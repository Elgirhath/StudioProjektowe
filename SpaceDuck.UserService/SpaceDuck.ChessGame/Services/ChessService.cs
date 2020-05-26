using SpaceDuck.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceDuck.ChessGame.Services
{
    public interface IChessService
    {
        string SelectCurrentPlayer(Game game);
        void UpdateUsersPoints(Dictionary<string, int> usersPoints);
        string SelectFirstPlayer(Game game);
    }

    public class ChessService : IChessService
    {
        private IRankingService RankingService;
        private GameType GameType = GameType.ChessGame;

        public ChessService(IRankingService rankingService)
        {
            RankingService = rankingService;
        }

        public string SelectCurrentPlayer(Game game)
           
        {
            var chessGame = (game as Common.Models.ChessGame);

            var player = chessGame.Room.Players.FirstOrDefault(p => p.Id == chessGame.CurrentPlayerId);

            int index = chessGame.Room.Players.IndexOf(player);

            if (index == chessGame.Room.Players.Count-1)
                index = 0;
            else
                index++;

            chessGame.CurrentPlayerId = chessGame.Room.Players.ElementAt(index).Id;
            return chessGame.Room.Players.ElementAt(index).Id;
        }

        public string SelectFirstPlayer(Game game)
        {
            var chessGame = (game as Common.Models.ChessGame);
            chessGame.CurrentPlayerId = chessGame.Room.Players.ElementAt(0).Id;

            return chessGame.Room.Players.ElementAt(0).Id;
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