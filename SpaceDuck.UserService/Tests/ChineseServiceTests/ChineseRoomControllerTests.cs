using Moq;
using SpaceDuck.ChineseGame.Controllers;
using SpaceDuck.Common.Models;
using Tests.Helpers;
using NUnit.Framework;
using SpaceDuck.ChineseGame.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Tests.ChineseServiceTests
{
    public class ChineseRoomControllerTests
    {
        private RoomController roomController;
        private RoomHelper roomHelper;
        private Mock<IRoomService> mockRoomService;

        public ChineseRoomControllerTests()
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
        public async Task TestGetRoom_ReturnsOk_NoRoom()
        {

            roomController = new RoomController(mockRoomService.Object);
            var getRoomResult = await roomController.GetRoom(roomHelper.roomChinese.Id);

            OkObjectResult result = getRoomResult as OkObjectResult;
            Assert.NotNull(result);
            Assert.AreEqual($"There is no room: {roomHelper.roomChinese.Id}", result.Value);
            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task TestGetRoom_ReturnsOk_Room()
        {
            mockRoomService.Setup(x => x.GetRoom(roomHelper.roomChinese.Id))
              .Returns(Task.FromResult(roomHelper.roomChinese));
            roomController = new RoomController(mockRoomService.Object);
            var getRoomResult = await roomController.GetRoom(roomHelper.roomChinese.Id);

            OkObjectResult result = getRoomResult as OkObjectResult;
            Assert.NotNull(result);
            Assert.AreEqual(mockRoomService.Object.GetRoom(roomHelper.roomChinese.Id).Result, result.Value);
            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task TestCreateRoom_ReturnsOk_Room()
        {
            mockRoomService.Setup(x => x.CreateRoom(It.IsAny<RoomConfiguration>(), It.IsAny<GameType>()))
             .Returns(roomHelper.roomChinese);
            roomController = new RoomController(mockRoomService.Object);
            var createRoomsResult = await roomController.CreateRoom(new RoomConfiguration());

            OkObjectResult result = createRoomsResult as OkObjectResult;
            Assert.NotNull(result);
            Assert.AreEqual(roomHelper.roomChinese, result.Value);
            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task TestAddPlayerToRoom_ReturnsOk_Added()
        {
            mockRoomService.Setup(x => x.AddPlayerToRoom(roomHelper.roomChinese.Id, roomHelper.player.Id, roomHelper.player.Name))
              .Returns(Task.FromResult(true));
            roomController = new RoomController(mockRoomService.Object);
            var getRoomResult = await roomController.AddPlayerToRoom(roomHelper.roomChinese.Id, roomHelper.player.Id, roomHelper.player.Name);

            OkObjectResult result = getRoomResult as OkObjectResult;
            Assert.NotNull(result);
            Assert.AreEqual($"Add to room: {roomHelper.roomChinese.Id}", result.Value);
            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task TestAddPlayerToRoom_ReturnsOk_NotAdded()
        {
            mockRoomService.Setup(x => x.AddPlayerToRoom(roomHelper.roomChinese.Id, roomHelper.player.Id, roomHelper.player.Name))
              .Returns(Task.FromResult(false));
            roomController = new RoomController(mockRoomService.Object);
            var getRoomResult = await roomController.AddPlayerToRoom(roomHelper.roomChinese.Id, roomHelper.player.Id, roomHelper.player.Name);

            OkObjectResult result = getRoomResult as OkObjectResult;
            Assert.NotNull(result);
            Assert.AreEqual($"Can not add to room: {roomHelper.roomChinese.Id}", result.Value);
            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task TestRemoveRoomAsOwner_ReturnsOk_Removed()
        {
            mockRoomService.Setup(x => x.RemoveRoom(roomHelper.roomChinese.Id, roomHelper.player.Id))
              .Returns(Task.FromResult(true));
            roomController = new RoomController(mockRoomService.Object);
            var getRoomResult = await roomController.RemoveRoomAsOwner(roomHelper.roomChinese.Id, roomHelper.player.Id);

            OkObjectResult result = getRoomResult as OkObjectResult;
            Assert.NotNull(result);
            Assert.AreEqual($"Remove room: {roomHelper.roomChinese.Id}", result.Value);
            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task TestRemoveRoomAsOwner_ReturnsOk_NotRemoved()
        {
            mockRoomService.Setup(x => x.RemoveRoom(roomHelper.roomChinese.Id, roomHelper.player.Id))
              .Returns(Task.FromResult(false));
            roomController = new RoomController(mockRoomService.Object);
            var getRoomResult = await roomController.RemoveRoomAsOwner(roomHelper.roomChinese.Id, roomHelper.player.Id);

            OkObjectResult result = getRoomResult as OkObjectResult;
            Assert.NotNull(result);
            Assert.AreEqual($"Can not remove room: {roomHelper.roomChinese.Id}", result.Value);
            Assert.AreEqual(200, result.StatusCode);
        }


    }
}
