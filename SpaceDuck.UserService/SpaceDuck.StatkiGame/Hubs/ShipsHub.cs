using Microsoft.AspNetCore.SignalR;
using SpaceDuck.Common.Models;
using SpaceDuck.ShipsGame.Server;
using SpaceDuck.ShipsGame.Services;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace SpaceDuck.ShipsGame.Hubs
{
    public interface IShipsHub
    {
        Task SendMessage(string user, string message);
        Task Shoot(string gameId, string userId, string userName, string charCoordinates, int intCoordinates);
        Task AlocateShips(string gameId, ShipsBoard shipsBoard);
        Task AddToGameGroup(string gameId, string playerId, string playerName);
        Task RemoveFromGameGroup(string gameId, string playerId, string playerName);
        Task SendGameStatus(string gameId, ShipsGameStatus gameStatus);
        void RecieveGameStatus(string gameId, ShipsGameStatus gameStatus);
        Task SendMesage(string gameId, string message);
        Task SendPoints(string gameId, Dictionary<string, int> points);
    }

    public class ShipsHub : Hub, IShipsHub
    {
        private readonly IHubContext<ShipsHub> _hubContext;
        private IGameHelper _gameHelper;
        private IRoomService _roomService;
        private IShipsService _shipsService;

        public ShipsHub(IHubContext<ShipsHub> hubContext,
            IGameHelper gameHelper,
            IRoomService roomService,
            IShipsService shipsService)
        {
            _hubContext = hubContext;
            _gameHelper = gameHelper;
            _shipsService = shipsService;
            _roomService = roomService;
        }

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task Shoot(string gameId, string userId, string userName, string charCoordinates, int intCoordinates)
        {
            var resp = _shipsService.Shoot(gameId, userId, userName, intCoordinates, charCoordinates[0]);
            await SendMesage(gameId, resp.Item1);
            await SendGameStatus(gameId, resp.Item2);
        }

        public async Task AlocateShips(string gameId, ShipsBoard board)
        {
            await SendGameStatus(gameId, _shipsService.UpdateBoard(board, gameId));
        }

        public async Task AddToGameGroup(string gameId, string playerId, string playerName)
        {
            try
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, gameId);

                await SendToGameGroup(gameId, "Send", $"{playerName} has joined the game.");

                //await _roomService.AddPlayerToRoom(Convert.ToInt32(gameId), playerId, playerName);
                await SendGameStatus(gameId, _shipsService.GetStatus(gameId));
            }
            catch (Exception e)
            {
                throw e;
            }

        }

        public async Task RemoveFromGameGroup(string gameId, string playerId, string playerName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameId);

            await SendToGameGroup(gameId, "Send", $"{playerName} has left the game.");
        }

        public async Task SendGameStatus(string gameId, ShipsGameStatus gameStatus)
        {
            await _hubContext.Clients.Group(gameId).SendAsync("GameStatus", gameStatus);
        }

        public async Task SendMesage(string gameId, string message)
        {
            await _hubContext.Clients.Group(gameId).SendAsync("Send", message);
        }

        public async Task SendPoints(string gameId, Dictionary<string, int> points)
        {
            await _hubContext.Clients.Group(gameId).SendAsync("Points", points);
        }

        public void RecieveGameStatus(string gameId, ShipsGameStatus gameStatus)
        {
            _gameHelper.UpdateBoard(gameId, gameStatus);
        }

        private async Task SendToGameGroup(string gameId, string method, object arg)
        {
            await Clients.Group(gameId).SendAsync(method, arg);
        }
    }
}
