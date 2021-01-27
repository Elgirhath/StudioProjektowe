using SpaceDuck.Common.Models;
using SpaceDuck.ChineseGame.Hubs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpaceDuck.ChineseGame.Server
{
    public interface IGameMiddleware
    {
        Task SendMesage(string gameId, string message);
        Task SendGameStatus(string gameId, ChineseGameStatus gameStatus);
        Task SendPoints(string gameId, Dictionary<string, int> points);
    }

    public class GameMiddleware : IGameMiddleware
    {
        private IChineseHub _chineseHub;

        public GameMiddleware(IChineseHub chineseHub)
        {
            _chineseHub = chineseHub;
        }

        public async Task SendGameStatus(string gameId, ChineseGameStatus gameStatus)
        {
            await _chineseHub.SendGameStatus(gameId, gameStatus);
        }

        public async Task SendMesage(string gameId, string message)
        {
            await _chineseHub.SendMesage(gameId, message);
        }

        public async Task SendPoints(string gameId, Dictionary<string, int> points)
        {
            await _chineseHub.SendPoints(gameId, points);
        }
    }
}
