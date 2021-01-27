using SpaceDuck.Common.Models;
using SpaceDuck.ChineseGame.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceDuck.ChineseGame.Server
{
    public interface IGameHelper
    {
        List<GameTask> gameTasks { get; set; }
        bool AddPlayer(string gameId, string playerId, string playerName);
        void RemovePlayer(string gameId, string playerId);
        void UpdateBoard(string gameId, ChineseGameStatus gameStatus);
    }

    public class GameHelper : IGameHelper
    {
        public List<GameTask> gameTasks { get; set; }
        private IChineseService chineseService;

        public GameHelper(IChineseService chineseService)
        {
            this.chineseService = chineseService;

            gameTasks = new List<GameTask>();
        }

        public bool AddPlayer(string gameId, string playerId, string playerName)
        {
            var game = gameTasks.FirstOrDefault(g => g.Game.Room.Id.ToString() == gameId);

            if (game == null) return false;

            if(!game.IsStarted)
            {
                game.Game.Room.Players.Add(new Player { Id = playerId, Name = playerName });
                if (!game.Game.PlayersPointsPerGame.ContainsKey(playerId))
                    game.Game.PlayersPointsPerGame.Add(playerId, 0);
                return true;
            }

            return false;
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

        public void UpdateBoard(string gameId, ChineseGameStatus gameStatus)
        {
            var game = gameTasks.FirstOrDefault(g => g.Game.Room.Id.ToString() == gameId);

            game.GameStatus.Board = gameStatus.Board;
        }
    }
}
