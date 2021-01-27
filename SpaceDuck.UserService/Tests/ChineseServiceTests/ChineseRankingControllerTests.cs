using System;
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
    [TestFixture]
    public class ChineseRankingControllerTests
    {
        private RankingController rankingController;
        private RankingHelper rankingHelper;
        private Mock<IRankingService> mockRankingService;

        public ChineseRankingControllerTests()
        {
            mockRankingService = new Mock<IRankingService>();
            rankingHelper = new RankingHelper();
        }

        //[Test]
        //public async Task TestAddPointsToPlayer_ReturnsOk()
        //{
        //    mockRankingService.Setup(x => x.AssingPointToPlayer(It.IsAny<UserPoints>(), It.IsAny<GameType>())).Returns(Task.FromResult("meh"));
        //    rankingController = new RankingController(mockRankingService.Object);
        //    var addPointsToPlayerResult = await rankingController.AddPointsToPlayer(rankingHelper.userPoints);
        //    OkObjectResult result = addPointsToPlayerResult as OkObjectResult;
        //    Assert.NotNull(result);
        //    Assert.AreEqual(200, result.StatusCode);
        //}

        [Test]
        public void TestGetPlayerRanking_ReturnsOk()
        {
            rankingController = new RankingController(mockRankingService.Object);
            var getPlayerRankingResult = rankingController.GetPlayerRanking(rankingHelper.playerId);

            OkObjectResult result = getPlayerRankingResult as OkObjectResult;
            Assert.NotNull(result);
            Assert.AreEqual(mockRankingService.Object.GetPlayerPoints(rankingHelper.playerId,GameType.ChineseGame), result.Value);
            Assert.AreEqual(200, result.StatusCode);
        }

     

        [Test]
        public void TestDeleteRankingForPlayer_ReturnsNoContent()
        {
            rankingController = new RankingController(mockRankingService.Object);
            var deleteRankingForPlayerResult = rankingController.DeleteRankingForPlayer(rankingHelper.ranking.UserId);
            NoContentResult result = deleteRankingForPlayerResult as NoContentResult;
            Assert.NotNull(result);
            Assert.AreEqual(204, result.StatusCode);
        }

        [Test]
        public async Task TestGetTopPlayers_ReturnsOk()
        {
            rankingController = new RankingController(mockRankingService.Object);
            var getTopPlayersResult = await rankingController.GetTopPlayers(rankingHelper.limit);
            OkObjectResult result = getTopPlayersResult as OkObjectResult;
            Assert.NotNull(result);
            Assert.AreEqual(mockRankingService.Object.GetTopPlayers(rankingHelper.limit, GameType.ChineseGame), result.Value);
            Assert.AreEqual(200, result.StatusCode);
        }

    }
}
