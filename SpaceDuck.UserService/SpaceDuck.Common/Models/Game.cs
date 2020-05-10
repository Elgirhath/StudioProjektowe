﻿using System.Collections.Generic;

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

    public class WordStatus
    {
        public string Word { get; set; }
        public string PlayerId { get; set; }
        public string PlayerName { get; set; }
    }
}