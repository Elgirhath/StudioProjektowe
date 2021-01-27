using SpaceDuck.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceDuck.ShipsGame.Server
{
    public class GameTask
    {
        public bool IsStarted { get; set; } = false;
        public bool IsFinshed { get; set; } = false;
        public bool IsEnded { get; set; } = false;
        private int DurationTime = 0;
        public ShipsGameStatus GameStatus { get; set; }
        public Common.Models.ShipsGame Game { get; set; }


        public GameTask(ShipsGameStatus gameStatus, Common.Models.ShipsGame game)
        {
            GameStatus = gameStatus;
            Game = game;
        }

        public void CheckRound()
        {
            if (GameStatus.Boards[0].AreShipsAllocated && GameStatus.Boards[1].AreShipsAllocated)
            {
                IsStarted = true;
            }
            if(IsStarted)
            {
                if (DurationTime > Game.Room.RoomConfiguration.RoundDuration)
                {
                    IsFinshed = true;
                }

                DurationTime++;
                GameStatus.RoundTime++;
            }
        }

        public void CheckStatus()
        {
            if (GameStatus.IsFinished) IsFinshed = true;
        }

        public void GenerateNewRound(Func<ShipsGameStatus, Game, string> generateCurrentPlayer)
        {
            GameStatus.CurrentPlayerId = generateCurrentPlayer(GameStatus, Game);
            GameStatus.CurrentPlayerName = Game.Room.Players.FirstOrDefault(pl => pl.Id == GameStatus.CurrentPlayerId).Name;
            GameStatus.IsFinished = false;
            GameStatus.RoundTime = 0;
            DurationTime = 0;
            IsFinshed = false;
        }

        private ShipsField[][] CreateBoard()
        {
            ShipsField[][] board = new ShipsField[10] [];
            for(var i = 0; i < 10; i++)
            {
                board[i] = new ShipsField[10];
                for (var j = 0; j < 10; j++)
                {
                    board[i][j] = new ShipsField
                    {
                        IntCoordinates = i,
                        CharCoordinates = Convert.ToChar(j + 65)
                    };
                }
            }
            return board;
        }

        public void GenerateNewGame(Room room)
        {
            GameStatus.IsReady = false;
            GameStatus.IsFinished = false;
            GameStatus.RoundTime = 0;
            DurationTime = 0;
            IsFinshed = false;
            GameStatus.Boards = new ShipsBoard[2];
            GameStatus.Boards[0] = new ShipsBoard
            {
                PlayerId = room.Players[0].Id,
                PlayerName = room.Players[0].Name,
                AreShipsAllocated = false,
                Board = CreateBoard()
            };
            GameStatus.Boards[1] = new ShipsBoard
            {
                PlayerId = room.Players[1].Id,
                PlayerName = room.Players[1].Name,
                AreShipsAllocated = false,
                Board = CreateBoard()
            };
            GameStatus.CurrentPlayerId = room.Players[0].Id;
            GameStatus.CurrentPlayerName = room.Players[0].Name;
            Game.Players.Add(room.Players[0].Id);
            Game.Players.Add(room.Players[1].Id);
        }

        public void UpdatePoints(string winner, string looser)
        {
            Game.PlayersPointsPerGame[winner] += 100;
            Game.PlayersPointsPerGame[looser] -= 50;
        }
    }
}
