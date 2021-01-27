using System;
using SpaceDuck.Common.Models;

namespace Tests.Helpers
{
    public class RankingHelper
    {
        public string playerId = "playerId";
        public int limit = 5;
        public Ranking ranking;
        public UserPoints userPoints;

        public RankingHelper()
        {
            int id = 1;
            string userId = "user_id";
            GameType gameType = GameType.KalamburyGame;
            int points = 100;

            ranking = new Ranking
            {
                Id = id,
                UserId = userId,
                GameType = gameType,
                Points = points
            };

            userPoints = new UserPoints {
                UserId = userId,
                Points = points
            };
        }
    }
}
