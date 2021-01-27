using System;
using System.Collections.Generic;
using System.Text;

namespace SpaceDuck.Common.Models
{
    public class Game
    {
        public string Id { get; set; }
        public Room Room { get; set; }
        public Dictionary<string, int> PlayersPointsPerGame { get; set; }
    }

    public class KalamburyGame : Game
    {
        public string CurrentPlayerId { get; set; }
        public Queue<string> SubmittedForDrawingQue { get; set; } = new Queue<string>();
    }

    public class ShipsGame : Game
    {
        public List<string> Players { get; set; }
    }

    public class GameStatus
    {
        public string Word { get; set; } = "";
        public string Canvas { get; set; }
        public string CurrentPlayerId { get; set; }
        public bool IsFinished { get; set; }
        public string Hint { get; set; } = "";
        public int Round { get; set; } = 0;
        public int RoundTime { get; set; } = 0;
    }

    public class ChessGameStatus
    {
        public string Board { get; set; } = "";
        public string CurrentPlayerId { get; set; }
        public string Result { get; set; } = ""; // "draw" for draw. Winner id otherwise
        public bool IsFinished { get; set; }
        public string ResignedPlayerId { get; set; } = "";
        public bool DrawOffered { get; set; } 
        public bool DrawAccepted { get; set; } 
        public int WhiteClock { get; set; } = 0;
        public int BlackClock { get; set; } = 0;
    }

    public class WordStatus
    {
        public string Word { get; set; }
        public string PlayerId { get; set; }
        public string PlayerName { get; set; }
    }

    public class ShipsField
    {
        public bool IsShip { get; set; } = false;
        public bool IsShot { get; set; } = false;
        public bool IsSunk { get; set; } = false;
        public bool TriedToShoot { get; set; } = false;
        public ShipType ShipType { get; set; }
        public int PartsDestroyed { get; set; } = 0;
        public int IntCoordinates { get; set; }
        public char CharCoordinates { get; set; }
    }

    public class ShipsBoard
    {
        public string PlayerId { get; set; }
        public string PlayerName { get; set; }
        public ShipsField[][] Board { get; set; }
        public int ShipsSunk { get; set; } = 0;
        public bool AreShipsAllocated { get; set; } = false;
    }

    public class Move
    {
        public ShipsField Field { get; set; }
        public string PlayerId { get; set; }

    }

    public class ShipsGameStatus
    {
        public ShipsBoard[] Boards { get; set; }
        public string CurrentPlayerId { get; set; }
        public string CurrentPlayerName { get; set; }
        public int RoundTime { get; set; } = 0;
        public bool IsFinished { get; set; }
        public bool IsReady { get; set; }
        public Move CurrentMove { get; set; }
    }
}
