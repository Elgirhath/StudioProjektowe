using Moq;
using SpaceDuck.ChessGame.Controllers;
using SpaceDuck.Common.Models;
using Tests.Helpers;
using NUnit.Framework;
using SpaceDuck.ChessGame.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Tests.ChessServiceTests
{
    public class ChessRoomControllerTests
    {
        private RoomController roomController;
        private RoomHelper roomHelper;
        private Mock<IRoomService> mockRoomService;

        public ChessRoomControllerTests()
        {
            mockRoomService = new Mock<IRoomService>();
            roomHelper = new RoomHelper();
        }

        [Test]
        public async Task TestGetRooms_ReturnsOk()
        {
            roomController = new RoomController(mockRoomService.Object);
            var getRoomsResult = await roomController.GetRooms();

            OkObjectResult result = getRoomsResult as OkObjectResult;
            Assert.NotNull(result);
            Assert.AreEqual(null, result.Value);
            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task TestCreateRoom_ReturnsOk_Room()
        {
            mockRoomService.Setup(x => x.CreateRoom(It.IsAny<RoomConfiguration>(), GameType.ChessGame, "purple"))
             .Returns(roomHelper.roomChess);
            roomController = new RoomController(mockRoomService.Object);
            var createRoomsResult = await roomController.CreateRoom(new RoomConfiguration(), "purple");

            OkObjectResult result = createRoomsResult as OkObjectResult;
            Assert.NotNull(result);
            Assert.AreEqual(roomHelper.roomChess, result.Value);
            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task TestGetRoom_ReturnsOk_NoRoom()
        {

            roomController = new RoomController(mockRoomService.Object);
            var getRoomResult =  await roomController.GetRoomAsync(roomHelper.roomChess.Id);

            OkObjectResult result = getRoomResult as OkObjectResult;
            Assert.NotNull(result);
            Assert.AreEqual($"There is no room: {roomHelper.roomChess.Id}", result.Value);
            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task TestGetRoom_ReturnsOk_Room()
        {
            mockRoomService.Setup(x => x.GetRoom(roomHelper.roomChess.Id))
              .Returns(Task.FromResult(roomHelper.roomChess));
            roomController = new RoomController(mockRoomService.Object);
            var getRoomResult = await roomController.GetRoomAsync(roomHelper.roomChess.Id);

            OkObjectResult result = getRoomResult as OkObjectResult;
            Assert.NotNull(result);
            Assert.AreEqual(mockRoomService.Object.GetRoom(roomHelper.roomChess.Id).Result, result.Value);
            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task TestAddPlayerToRoom_ReturnsOk_Added()
        {
            mockRoomService.Setup(x => x.AddPlayerToRoom(roomHelper.roomChess.Id, roomHelper.player.Id, roomHelper.player.Name))
              .Returns(Task.FromResult(true));
            roomController = new RoomController(mockRoomService.Object);
            var getRoomResult = await roomController.AddPlayerToRoom(roomHelper.roomChess.Id, roomHelper.player.Id, roomHelper.player.Name);

            OkObjectResult result = getRoomResult as OkObjectResult;
            Assert.NotNull(result);
            Assert.AreEqual($"Add to room: {roomHelper.roomChess.Id}", result.Value);
            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task TestAddPlayerToRoom_ReturnsOk_NotAdded()
        {
            mockRoomService.Setup(x => x.AddPlayerToRoom(roomHelper.roomChess.Id, roomHelper.player.Id, roomHelper.player.Name))
              .Returns(Task.FromResult(false));
            roomController = new RoomController(mockRoomService.Object);
            var getRoomResult = await roomController.AddPlayerToRoom(roomHelper.roomChess.Id, roomHelper.player.Id, roomHelper.player.Name);

            OkObjectResult result = getRoomResult as OkObjectResult;
            Assert.NotNull(result);
            Assert.AreEqual($"Can not add to room: {roomHelper.roomChess.Id}", result.Value);
            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task TestRemoveRoomAsOwner_ReturnsOk_Removed()
        {
            mockRoomService.Setup(x => x.RemoveRoom(roomHelper.roomChess.Id, roomHelper.player.Id))
              .Returns(Task.FromResult(true));
            roomController = new RoomController(mockRoomService.Object);
            var getRoomResult = await roomController.RemoveRoomAsOwner(roomHelper.roomChess.Id, roomHelper.player.Id);

            OkObjectResult result = getRoomResult as OkObjectResult;
            Assert.NotNull(result);
            Assert.AreEqual($"Remove room: {roomHelper.roomChess.Id}", result.Value);
            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task TestRemoveRoomAsOwner_ReturnsOk_NotRemoved()
        {
            mockRoomService.Setup(x => x.RemoveRoom(roomHelper.roomChess.Id, roomHelper.player.Id))
              .Returns(Task.FromResult(false));
            roomController = new RoomController(mockRoomService.Object);
            var getRoomResult = await roomController.RemoveRoomAsOwner(roomHelper.roomChess.Id, roomHelper.player.Id);

            OkObjectResult result = getRoomResult as OkObjectResult;
            Assert.NotNull(result);
            Assert.AreEqual($"Can not remove room: {roomHelper.roomChess.Id}", result.Value);
            Assert.AreEqual(200, result.StatusCode);
        }


    }
}
