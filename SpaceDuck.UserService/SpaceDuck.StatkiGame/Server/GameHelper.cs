using SpaceDuck.Common.Models;
using SpaceDuck.ShipsGame.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceDuck.ShipsGame.Server
{
    public interface IGameHelper
    {
        List<GameTask> gameTasks { get; set; }
        void AddPlayer(string gameId, string playerId, string playerName);
        void RemovePlayer(string gameId, string playerId);
        void UpdateBoard(string gameId, ShipsGameStatus gameStatus);
    }

    public class GameHelper : IGameHelper
    {
        public List<GameTask> gameTasks { get; set; }

        public GameHelper()
        {
            gameTasks = new List<GameTask>();
        }

        public void AddPlayer(string gameId, string playerId, string playerName)
        {
            var game = gameTasks.FirstOrDefault(g => g.Game.Room.Id.ToString() == gameId);

            game?.Game.Room.Players.Add(new Player { Id = playerId, Name = playerName });
            game?.Game.PlayersPointsPerGame.Add(playerId, 0);
        }

        public void RemovePlayer(string gameId, string playerId)
        {
            var game = gameTasks.FirstOrDefault(g => g.Game.Room.Id.ToString() == gameId);

            if (game == null)
                return;

            var player = game.Game.Room.Players.FirstOrDefault(p => p.Id == playerId);

            if (player != null )
                game.Game.Room.Players.Remove(player);

            if (game.GameStatus.CurrentPlayerId == playerId)
                game.IsFinshed = true;
                
        }

        public void UpdateBoard(string gameId, ShipsGameStatus gameStatus)
        {
            var game = gameTasks.FirstOrDefault(g => g.Game.Room.Id.ToString() == gameId);

            game.GameStatus.Boards = gameStatus.Boards;
        }
    }
}
