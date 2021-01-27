using Microsoft.AspNetCore.Mvc;
using SpaceDuck.Common.Models;
using SpaceDuck.ShipsGame.Server;
using SpaceDuck.ShipsGame.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceDuck.ShipsGame.Controllers
{
    [Route("ships/api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private IRoomService roomService;
        private static GameType GameType = GameType.KalamburyGame;

        private IGameServer gameServer;

        public GameController(IRoomService roomService, IGameServer gameServer)
        {
            this.roomService = roomService;
            this.gameServer = gameServer;
        }

        [Route("{roomId}")]
        [HttpGet]
        public async Task<IActionResult> GameStart(int roomId)
        {
            if (gameServer.gameHelper.gameTasks.FirstOrDefault(game => game.Game.Room.Id == roomId) != null 
                && gameServer.gameHelper.gameTasks.FirstOrDefault(game => game.Game.Room.Id == roomId).IsStarted)
                return Ok("Gra dla tego pokoju już działa.");

            var room = await roomService.GetRoom(roomId);

            if (room.Players.Count < 2)
                return Ok("Oczekiwanie na graczy.");

            await gameServer.CreateGame(room);

            return Ok();
        }

        [Route("{roomId}/restart")]
        [HttpGet]
        public async Task<IActionResult> GameRestart(int roomId)
        {
            if (gameServer.gameHelper.gameTasks.FirstOrDefault(game => game.Game.Room.Id == roomId) != null
                && gameServer.gameHelper.gameTasks.FirstOrDefault(game => game.Game.Room.Id == roomId).IsStarted)
                return Ok("Gra dla tego pokoju już działa.");

            var room = await roomService.GetRoom(roomId);

            if (room.Players.Count < 2)
                return Ok("Oczekiwanie na graczy.");

            var playerEmptyPoints = new Dictionary<string, int>();
            foreach (var item in room.Players)
            {
                playerEmptyPoints.Add(item.Id, 0);
            }

            var gameTask = new GameTask
            (
                new ShipsGameStatus(),
                new Common.Models.ShipsGame
                {
                    Id = Guid.NewGuid().ToString(),
                    Room = room,
                    PlayersPointsPerGame = playerEmptyPoints
                }
            );

            await gameServer.CreateGame(gameTask);

            return Ok();
        }
    }
}