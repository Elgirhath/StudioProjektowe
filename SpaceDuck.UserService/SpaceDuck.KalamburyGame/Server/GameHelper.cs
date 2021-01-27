using SpaceDuck.Common.Models;
using SpaceDuck.KalamburyGame.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceDuck.KalamburyGame.Server
{
    public interface IGameHelper
    {
        List<GameTask> gameTasks { get; set; }
        void AddPlayer(string gameId, string playerId, string playerName);
        void RemovePlayer(string gameId, string playerId);
        bool UpdateWordStatus(string gameId, WordStatus wordStatus);
        void UpdateCanvas(string gameId, GameStatus gameStatus);
        Queue<string> RemovePlayerFromQue(Queue<string> que, string playerId);
    }

    public class GameHelper : IGameHelper
    {
        public List<GameTask> gameTasks { get; set; }
        private IKalaburyService kalaburyService;

        public GameHelper(IKalaburyService kalaburyService)
        {
            this.kalaburyService = kalaburyService;

            gameTasks = new List<GameTask>();
        }

        public bool UpdateWordStatus(string gameId, WordStatus wordStatus)
        {
            var game = gameTasks.FirstOrDefault(g => g.Game.Room.Id.ToString() == gameId);

            if (CheckWord(game.GameStatus.Word, wordStatus.Word))
            {
                Func<Task<string>> generateWordMethod = kalaburyService.GetWord;
                Func<Game, string> generateCurrentPlayerMethod = kalaburyService.SelectCurrentPlayer;

                game.WasGuessed = true;
                game.IsFinshed = true;
                game.UpdatePoints(wordStatus.PlayerId);

                return true;
            }
            return false;
        }

        public void AddPlayer(string gameId, string playerId, string playerName)
        {
            var game = gameTasks.FirstOrDefault(g => g.Game.Room.Id.ToString() == gameId);
            if (!(bool)game?.Game.PlayersPointsPerGame.ContainsKey(playerId))
            {
                game?.Game.PlayersPointsPerGame.Add(playerId, 0);

            }
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

            if (game.Game.SubmittedForDrawingQue.Contains(playerId))
            {
                game.Game.SubmittedForDrawingQue = RemovePlayerFromQue(game.Game.SubmittedForDrawingQue, playerId);
            }
                
        }

        public Queue<string> RemovePlayerFromQue(Queue<string> que, string playerId) 
        {
            Queue<string> retVal = new Queue<string>();

            for (int i = 0; i < que.Count - 1; i++)
            {
                if (que.ElementAt(i) != playerId)
                {
                    retVal.Enqueue(que.ElementAt(i));
                }
            }

            return retVal;
        }

        public void UpdateCanvas(string gameId, GameStatus gameStatus)
        {
            var game = gameTasks.FirstOrDefault(g => g.Game.Room.Id.ToString() == gameId);

            game.GameStatus.Canvas = gameStatus.Canvas;
        }

        private bool CheckWord(string expected, string actual)
        {
            expected = expected.ToUpper().Trim().Replace(" ", "");
            actual = actual.ToUpper().Trim().Replace(" ", "");

            return expected.Equals(actual);
        }
    }
}
