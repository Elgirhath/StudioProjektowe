using SpaceDuck.Common.Models;
using SpaceDuck.ChineseGame.Services;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SpaceDuck.ChineseGame.Server
{
    public interface IGameServer
    {
        IGameHelper gameHelper { get; }
        Task CreateGame(int roomId);
        Task CreateGame(GameTask gameTask);
    }

    public class GameServer : IGameServer
    {
        private IChineseService chineseService;
        private IGameMiddleware gameMiddleware;
        public IGameHelper gameHelper { get; }

        public GameServer(IChineseService chineseService,
            IGameMiddleware gameMiddleware,
            IGameHelper gameHelper)
        {
            this.chineseService = chineseService;

            this.gameMiddleware = gameMiddleware;

            this.gameHelper = gameHelper;

            Thread thread = new Thread(StartServer);
            thread.Start();
        }

        private void StartServer()
        {
            Func<Game, string> generateCurrentPlayerMethod = chineseService.SelectCurrentPlayer;
            Console.WriteLine("Server started.");

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
                        gameMiddleware.SendMesage(gameTask.Game.Room.Id.ToString(), $"Czas minał. Koniec rundy dla gracza ${gameTask.Game.Room.Players.First(p => p.Id == gameTask.Game.CurrentPlayerId).Name}");
                        gameTask.GenerateNewRound(generateCurrentPlayerMethod);
                        gameMiddleware.SendMesage(gameTask.Game.Room.Id.ToString(), $"Nowa runda dla gracza ${gameTask.Game.Room.Players.First(p => p.Id == gameTask.Game.CurrentPlayerId).Name}");
                        continue;
                    }

                    if (gameTask.IsEnded)
                    {
                        gameTask.UpdatePoints();
                        chineseService.UpdateUsersPoints(gameTask.Game.PlayersPointsPerGame);
                        gameMiddleware.SendPoints(gameTask.Game.Room.Id.ToString(), gameTask.Game.PlayersPointsPerGame);
                        gameTask.GameStatus.IsFinished = true;
                        gameMiddleware.SendMesage(gameTask.Game.Room.Id.ToString(), "Koniec gry");
                        continue;
                    }

                    gameMiddleware.SendGameStatus(gameTask.Game.Room.Id.ToString(), gameTask.GameStatus);
                }

                gameHelper.gameTasks.RemoveAll(game => game.IsEnded);


                Thread.Sleep(1000);
            }
            Console.WriteLine("Server ended.");
        }

        public async Task CreateGame(int roomId)
        {
            Func<Game, string> generateCurrentPlayerMethod = chineseService.SelectCurrentPlayer;

            var gameTask = gameHelper.gameTasks.FirstOrDefault(game => game.Game.Room.Id == roomId);

            await gameTask.GenerateNewRound(generateCurrentPlayerMethod);

            gameMiddleware.SendGameStatus(gameTask.Game.Room.Id.ToString(), gameTask.GameStatus);
            gameMiddleware.SendPoints(gameTask.Game.Room.Id.ToString(), gameTask.Game.PlayersPointsPerGame);

            gameTask.IsStarted = true;
        }

        public async Task CreateGame(GameTask gameTask)
        {
            gameHelper.gameTasks.Add(gameTask);

            CreateGame(gameTask.Game.Room.Id);
        }
    }


}
