using Microsoft.AspNetCore.Mvc;
using SpaceDuck.ChineseGame.Server;
using SpaceDuck.ChineseGame.Services;
using SpaceDuck.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceDuck.ChineseGame.Controllers
{
    [Route("chinese/api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private IRoomService roomService;
        private static GameType GameType = GameType.ChineseGame;

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

           // if (room.Players.Count < 2)
               // return Ok("Oczekiwanie na graczy.");

            gameServer.CreateGame(roomId);

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
                new ChineseGameStatus(),
                new Common.Models.ChineseGame
                {
                    Id = Guid.NewGuid().ToString(),
                    Room = room,
                    PlayersPointsPerGame = playerEmptyPoints
                }
            );

            gameServer.CreateGame(gameTask);

            return Ok();
        }
    }
}