using Microsoft.AspNetCore.SignalR;
using SpaceDuck.Common.Models;
using SpaceDuck.ChineseGame.Server;
using SpaceDuck.ChineseGame.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpaceDuck.ChineseGame.Hubs
{
    public interface IChineseHub
    {
        Task SendMessage(string user, string message);
        Task AddToGameGroup(string gameId, string playerId, string playerName);
        Task RemoveFromGameGroup(string gameId, string playerId, string playerName);
        Task SendGameStatus(string gameId, ChineseGameStatus gameStatus);
        Task RecieveGameStatus(string gameId, ChineseGameStatus gameStatus);
        Task SendMesage(string gameId, string message);
        //Task CheckGivenWord(string gameId, WordStatus wordStatus);
        Task SendPoints(string gameId, Dictionary<string, int> points);
    }

    public class ChineseHub : Hub, IChineseHub
    {
        private readonly IHubContext<ChineseHub> _hubContext;
        private IGameHelper _gameHelper;
        private IRoomService _roomService;

        public ChineseHub(IHubContext<ChineseHub> hubContext,
            IGameHelper gameHelper,
            IRoomService roomService)
        {
            _hubContext = hubContext;
            _gameHelper = gameHelper;
            _roomService = roomService;
        }

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task AddToGameGroup(string gameId, string playerId, string playerName)
        {
            try
            {
                var result = await _roomService.AddPlayerToRoom(Convert.ToInt32(gameId), playerId, playerName);

                if (result)
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, gameId);

                    await SendToGameGroup(gameId, "Send", $"{playerName} has joined the game.");
                }
                else
                {
                    await Clients.Client(Context.ConnectionId).SendAsync("Error", "Couldn't join to game.");
                }
            }
            catch (Exception)
            { }

        }

        public async Task RemoveFromGameGroup(string gameId, string playerId, string playerName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameId);

            await SendToGameGroup(gameId, "Send", $"{playerName} has left the game.");

            await _roomService.RemovePlayerFromRoom(Convert.ToInt32(gameId), playerId);

        }

        public async Task SendGameStatus(string gameId, ChineseGameStatus gameStatus)
        {
            await _hubContext.Clients.Group(gameId).SendAsync("GameStatus", gameStatus);
            await _hubContext.Clients.Group(gameId).SendAsync("Send", "Update status by contexthub.");
        }

        public async Task SendMesage(string gameId, string message)
        {
            await _hubContext.Clients.Group(gameId).SendAsync("Send", message);
        }

        public async Task SendPoints(string gameId, Dictionary<string, int> points)
        {
            await _hubContext.Clients.Group(gameId).SendAsync("Points", points);
        }

        public async Task RecieveGameStatus(string gameId, ChineseGameStatus gameStatus)
        {
            _gameHelper.UpdateBoard(gameId, gameStatus);
        }

        //public async Task CheckGivenWord(string gameId, WordStatus wordStatus)
        //{
        //    var isCorrect = _gameHelper.UpdateWordStatus(gameId, wordStatus);

        //    if (isCorrect)
        //        await SendMesage(gameId, $"Gracz {wordStatus.PlayerName} zgadł hasło {wordStatus.Word}");
        //}

        private async Task SendToGameGroup(string gameId, string method, object arg)
        {
            Clients.Group(gameId).SendAsync(method, arg);
        }
    }
}
