using Microsoft.AspNetCore.Mvc;
using SpaceDuck.Common.Models;
using SpaceDuck.ShipsGame.Services;
using System.Threading.Tasks;

namespace SpaceDuck.ShipsGame.Controllers
{
    [Route("ships/api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private IRoomService roomService;
        private static GameType GameType = GameType.KalamburyGame;

        public RoomController(IRoomService roomService)
        {
            this.roomService = roomService;
        }

        [Route("all")]
        [HttpGet]
        public async Task<ActionResult> GetRooms()
        {
            return Ok(await roomService.GetRooms(GameType));
        }

        [Route("{roomId}")]
        [HttpGet]
        public async Task<ActionResult> GetRoom(int roomId)
        {
            var room = await roomService.GetRoom(roomId);
            if(room == null)
            {
                return Ok($"There is no room: {roomId}");
            }
            return Ok(await roomService.GetRoom(roomId));
        }

        [HttpPost]
        public async Task<ActionResult> CreateRoom(RoomConfiguration roomConfiguration)
        {
            var room = roomService.CreateRoom(roomConfiguration, GameType);

            await roomService.SetRoom(room);

            return Ok(room);
        }

        [Route("{roomId}/{playerId}/{playerName}")]
        [HttpPost]
        public async Task<ActionResult> AddPlayerToRoom(int roomId, string playerId, string playerName)
        {
            var result = await roomService.AddPlayerToRoom(roomId, playerId, playerName);

            var message = result ? $"Add to room: {roomId}" : $"Can not add to room: {roomId}";

            return Ok(message);
        }

        [Route("{roomId}/owner/{playerId}")]
        [HttpDelete]
        public async Task<ActionResult> RemoveRoomAsOwner(int roomId, string playerId)
        {
            var result = await roomService.RemoveRoom(roomId, playerId);

            var message = result ? $"Remove room: {roomId}" : $"Can not remove room: {roomId}";

            return Ok(message);
        }
    }
}