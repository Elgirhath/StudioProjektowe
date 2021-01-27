using SpaceDuck.Common.Models;
using System;
using System.Threading.Tasks;

namespace SpaceDuck.ChineseGame.Server
{
    public class GameTask
    {
        public bool IsStarted { get; set; } = false;
        public bool IsFinshed { get; set; } = false;
        public bool IsEnded { get; set; } = false;
        private int DurationTime = 0;
        private int Round = 0;
        public ChineseGameStatus GameStatus { get; set; }
        public Common.Models.ChineseGame Game { get; set; }


        public GameTask(ChineseGameStatus gameStatus, Common.Models.ChineseGame game)
        {
            GameStatus = gameStatus;
            Game = game;
        }

        public void CheckRound()
        {
            if (DurationTime > Game.Room.RoomConfiguration.RoundDuration)
            {
                IsFinshed = true;
            }

            if (Round > Game.Room.RoomConfiguration.RoundCount)
            {
                IsEnded = true;
            }

            DurationTime++;
            GameStatus.RoundTime++;
        }

        public void CheckStatus()
        {
            if (GameStatus.IsFinished) IsFinshed = true;
        }

        public async Task GenerateNewRound(Func<Game, string> generateCurrentPlayer)
        {
            GameStatus.CurrentPlayerId = generateCurrentPlayer(Game);
            GameStatus.IsFinished = false;  
            GameStatus.Round++;
            GameStatus.RoundTime = 0;
            DurationTime = 0;
            Round++;
            IsFinshed = false;
        }

        public void UpdatePoints()
        {

            Game.PlayersPointsPerGame[GameStatus.CurrentPlayerId] += 100;

            foreach (var player in Game.PlayersPointsPerGame)
            {
                if (player.Key == GameStatus.CurrentPlayerId)
                    Game.PlayersPointsPerGame[player.Key] += 100;
                else
                    Game.PlayersPointsPerGame[player.Key] -= 50;
            }
        }
    }
}
