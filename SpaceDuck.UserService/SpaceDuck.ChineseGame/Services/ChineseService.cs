using SpaceDuck.Common.Models;
using System.Collections.Generic;
using System.Linq;

namespace SpaceDuck.ChineseGame.Services
{
    public interface IChineseService
    {
        string SelectCurrentPlayer(Game game);
        void UpdateUsersPoints(Dictionary<string, int> usersPoints);
    }

    public class ChineseService : IChineseService
    {
        private IRankingService RankingService;
        private GameType GameType = GameType.ChineseGame;

        public ChineseService(IRankingService rankingService)
        {
            RankingService = rankingService;
        }

        public string SelectCurrentPlayer(Game game)
        {
            var chineseGame = (game as Common.Models.ChineseGame);

            var player = chineseGame.Room.Players.FirstOrDefault(p => p.Id == chineseGame.CurrentPlayerId);

            if (player == null)
            {
                return chineseGame.Room.Players.ElementAt(0).Id;
            }

            int index = chineseGame.Room.Players.IndexOf(player);

            if (index == chineseGame.Room.Players.Count)
                index = 0;
            else
                index++;

            return chineseGame.Room.Players.ElementAt(index).Id;
        }

        public async void UpdateUsersPoints(Dictionary<string, int> usersPoints)
        {
            foreach (var item in usersPoints)
            {
                await RankingService.AssingPointToPlayer(new UserPoints
                {
                    Points = item.Value,
                    UserId = item.Key
                }, GameType);
            }
        }
    }
}
