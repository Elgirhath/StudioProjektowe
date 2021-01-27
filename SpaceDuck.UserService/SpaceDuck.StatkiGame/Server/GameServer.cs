using SpaceDuck.Common.Models;
using SpaceDuck.ShipsGame.Services;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SpaceDuck.ShipsGame.Server
{
    public interface IGameServer
    {
        IGameHelper gameHelper { get; }
        Task CreateGame(Room roomd);
        Task CreateGame(GameTask gameTask);
    }

    public class GameServer : IGameServer
    {
        private IShipsService shipsService;
        private IGameMiddleware gameMiddleware;
        public IGameHelper gameHelper { get; }

        public GameServer(IShipsService shipsService,
            IGameMiddleware gameMiddleware,
            IGameHelper gameHelper)
        {
            this.shipsService = shipsService;

            this.gameMiddleware = gameMiddleware;

            this.gameHelper = gameHelper;

            Thread thread = new Thread(StartServer);
            thread.Start();
        }

        private async void StartServer()
        {
            Console.WriteLine("Server started.");
            Func<ShipsGameStatus, Game, string> generateCurrentPlayerMethod = shipsService.SelectCurrentPlayer;
            while (true)
            {
                Console.WriteLine($"Game count: {gameHelper.gameTasks.Count}");
                Console.WriteLine($"Running game count: {gameHelper.gameTasks.Where(g => g.IsStarted).ToList().Count}");

                foreach (var gameTask in gameHelper.gameTasks)
                {
                    if (!gameTask.IsStarted)
                        continue;

                    gameTask.CheckRound();

                    gameTask.CheckStatus();

                    if (gameTask.IsFinshed)
                    {
                        await gameMiddleware.SendMesage(gameTask.Game.Room.Id.ToString(), this.CreateMessage(gameTask));
                        gameTask.GenerateNewRound(generateCurrentPlayerMethod);

                        continue;
                    }

                    if (gameTask.IsEnded)
                    {
                        shipsService.UpdateUsersPoints(gameTask.Game.PlayersPointsPerGame);
                        gameTask.GameStatus.IsFinished = true;
                        await gameMiddleware.SendMesage(gameTask.Game.Room.Id.ToString(), "Koniec gry");
                        continue;
                    }

                    await gameMiddleware.SendGameStatus(gameTask.Game.Room.Id.ToString(), gameTask.GameStatus);
                }

                gameHelper.gameTasks.RemoveAll(game => game.IsEnded);


                Thread.Sleep(1000);
            }
        }

        public string CreateMessage(GameTask gameTask)
        {
            var message = $"User {gameTask.GameStatus.CurrentPlayerName} ";
            if (gameTask.GameStatus.CurrentMove == null)
            {
                message += "did not move.";
            }
            else
            {
                if (gameTask.GameStatus.CurrentMove.Field.IsSunk)
                {
                    message += "sunk ";
                }
                else if (gameTask.GameStatus.CurrentMove.Field.IsShot)
                {
                    message += "shot ";
                }
                else
                {
                    message += "missed ";
                }
                message += $"{gameTask.GameStatus.CurrentMove.Field.CharCoordinates} {gameTask.GameStatus.CurrentMove.Field.IntCoordinates}.";
            }
            return message;
        }

        public async Task CreateGame(Room room)
        {

            var gameTask = gameHelper.gameTasks.FirstOrDefault(game => game.Game.Room.Id == room.Id);

            gameTask.GenerateNewGame(room);

            await gameMiddleware.SendGameStatus(gameTask.Game.Room.Id.ToString(), gameTask.GameStatus);
            await gameMiddleware.SendPoints(gameTask.Game.Room.Id.ToString(), gameTask.Game.PlayersPointsPerGame);

            gameTask.IsStarted = true;
        }

        public async Task CreateGame(GameTask gameTask)
        {
            gameHelper.gameTasks.Add(gameTask);

            await CreateGame(gameTask.Game.Room);
        }
    }


}
