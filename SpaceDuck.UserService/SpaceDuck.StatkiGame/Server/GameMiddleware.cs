using SpaceDuck.Common.Models;
using SpaceDuck.ShipsGame.Hubs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpaceDuck.ShipsGame.Server
{
    public interface IGameMiddleware
    {
        Task SendMesage(string gameId, string message);
        Task SendGameStatus(string gameId, ShipsGameStatus gameStatus);
        Task SendPoints(string gameId, Dictionary<string, int> points);
    }

    public class GameMiddleware : IGameMiddleware
    {
        private IShipsHub shipsHub;

        public GameMiddleware(IShipsHub _shipsHub)
        {
            shipsHub = _shipsHub;
        }

        public async Task SendGameStatus(string gameId, ShipsGameStatus gameStatus)
        {
            await shipsHub.SendGameStatus(gameId, gameStatus);
        }

        public async Task SendMesage(string gameId, string message)
        {
            await shipsHub.SendMesage(gameId, message);
        }

        public async Task SendPoints(string gameId, Dictionary<string, int> points)
        {
            await shipsHub.SendPoints(gameId, points);
        }
    }
}
