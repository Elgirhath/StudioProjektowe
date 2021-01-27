using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using SpaceDuck.UserService.Controllers;
using SpaceDuck.UserService.Models;
using Tests.Helpers;
using NUnit.Framework;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace Tests.UserServiceTests
{
    [TestFixture]
    public class UserControllerUnitTests
    {
        private UserController userController;
        private Mock<UserManager<User>> mockUserManager;
        private Mock<SignInManager<User>> mockSignInManager;
        private Mock<IUserValidator<User>> mockUserValidator;
        private Mock<IPasswordValidator<User>> mockPasswordValidator;
        private Mock<IPasswordHasher<User>> mockPasswordHasher;
        private UserHelper userHelper;

        public UserControllerUnitTests()
        {
            var userStoreMock = new Mock<IUserStore<User>>();

            mockUserManager = new Mock<UserManager<User>>(userStoreMock.Object,
                null, null, null, null, null, null, null, null);
            

            var contextAccessor = new Mock<IHttpContextAccessor>();
            var userPrincipalFactory = new Mock<IUserClaimsPrincipalFactory<User>>();

            mockSignInManager = new Mock<SignInManager<User>>(mockUserManager.Object,
             contextAccessor.Object, userPrincipalFactory.Object, null, null, null, null);


            mockUserValidator = new Mock<IUserValidator<User>>();
            mockPasswordValidator = new Mock<IPasswordValidator<User>>();
            mockPasswordHasher = new Mock<IPasswordHasher<User>>();

            userHelper = new UserHelper();

        }

        [Test]
        public async Task TestRegisterUser_Success()
        {
            mockUserManager.Setup(x => x.CreateAsync(It.Is<User>(x => x.Email == userHelper.user.Email), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Success);
            userController = new UserController(mockUserManager.Object, mockSignInManager.Object, mockUserValidator.Object, mockPasswordValidator.Object, mockPasswordHasher.Object);

            var registerUserResult = await userController.RegisterUser(userHelper.registerModel);
            Assert.NotNull(registerUserResult);
            OkObjectResult result = registerUserResult as OkObjectResult;
            Assert.NotNull(result);
            var message = result.Value as String;
            Assert.AreEqual($"Please sing in {userHelper.registerModel.Name}", message);
            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task TestRegisterUser_Failed()
        {
            mockUserManager.Setup(x => x.CreateAsync(It.Is<User>(x => x.Email == userHelper.user.Email), It.IsAny<string>()))
           .ReturnsAsync(IdentityResult.Failed());
            userController = new UserController(mockUserManager.Object, mockSignInManager.Object, mockUserValidator.Object, mockPasswordValidator.Object, mockPasswordHasher.Object);

            var registerUserResult = await userController.RegisterUser(userHelper.registerModel);
            Assert.NotNull(registerUserResult);
            OkObjectResult result = registerUserResult as OkObjectResult;
            Assert.NotNull(result);
            var message = result.Value as String;
            Assert.AreEqual("This user can not be created!",message);
            Assert.AreEqual(200, result.StatusCode);

        }

        [Test]
        public async Task TestDeleteUser_Success()
        {
            mockUserManager.Setup(x => x.DeleteAsync(It.Is<User>(x => x.Id == userHelper.user.Id)))
           .ReturnsAsync(IdentityResult.Success);
            mockUserManager.Setup(x => x.FindByIdAsync(userHelper.user.Id))
           .Returns(Task.FromResult(userHelper.user));
            userController = new UserController(mockUserManager.Object, mockSignInManager.Object, mockUserValidator.Object, mockPasswordValidator.Object, mockPasswordHasher.Object);

            var deleteUserResult = await userController.DeleteUser(userHelper.user.Id);
            Assert.NotNull(deleteUserResult);
            NoContentResult result = deleteUserResult as NoContentResult;
            Assert.NotNull(result);
            Assert.AreEqual(204, result.StatusCode);

        }

        [Test]
        public async Task TestDeleteUser_Failed()
        {
            mockUserManager.Setup(x => x.DeleteAsync(It.Is<User>(x => x.Id == userHelper.user.Id)))
           .ReturnsAsync(IdentityResult.Failed());
            mockUserManager.Setup(x => x.FindByIdAsync(userHelper.user.Id))
           .Returns(Task.FromResult(userHelper.user));
            userController = new UserController(mockUserManager.Object, mockSignInManager.Object, mockUserValidator.Object, mockPasswordValidator.Object, mockPasswordHasher.Object);

            var deleteUserResult = await userController.DeleteUser(userHelper.user.Id);
            Assert.NotNull(deleteUserResult);
            BadRequestResult result = deleteUserResult as BadRequestResult;
            Assert.NotNull(result);
            Assert.AreEqual(400, result.StatusCode);

        }

        [Test]
        public async Task TestGetUserInfo_Success()
        {
            mockUserManager.Setup(x => x.FindByIdAsync(userHelper.user.Id))
           .Returns(Task.FromResult(userHelper.user));
            userController = new UserController(mockUserManager.Object, mockSignInManager.Object, mockUserValidator.Object, mockPasswordValidator.Object, mockPasswordHasher.Object);

            var getUseInforResult = await userController.GetUserInfo(userHelper.user.Id);
            Assert.NotNull(getUseInforResult);
            OkObjectResult result = getUseInforResult as OkObjectResult;
            Assert.NotNull(result);
            Assert.AreEqual(200, result.StatusCode);
            Assert.AreEqual(ApplicationUser.MapFromUser(userHelper.user).ToString(), result.Value.ToString());
        }

        [Test]
        public async Task TestLoginUser_Success()
        {
            
           
            mockUserManager.Setup(x => x.FindByEmailAsync(userHelper.user.Email))
                .Returns(Task.FromResult(userHelper.user));
            mockUserManager.Setup(x => x.FindByNameAsync(userHelper.user.UserName))
               .Returns(Task.FromResult(userHelper.user));
            mockSignInManager.Setup(x => x.PasswordSignInAsync(It.IsAny<User>(), It.IsAny<string>(), It.IsAny<bool>(),
            It.IsAny<bool>())).Returns(Task.FromResult(SignInResult.Success));
            mockSignInManager.Setup(x => x.SignOutAsync());
            userController = new UserController(mockUserManager.Object, mockSignInManager.Object, mockUserValidator.Object, mockPasswordValidator.Object, mockPasswordHasher.Object);

            var loginUserResult = await userController.LoginUser(userHelper.loginModel);
            Assert.NotNull(loginUserResult);
            OkObjectResult result = loginUserResult as OkObjectResult;
            Assert.NotNull(result);
            Assert.AreEqual(200, result.StatusCode);
           Assert.AreEqual(ApplicationUser.MapFromUser(userHelper.user).ToString(), result.Value.ToString());

        }

        [Test]
        public async Task TestLoginUser_Failed_Unauthorized()
        {
            userController = new UserController(mockUserManager.Object, mockSignInManager.Object, mockUserValidator.Object, mockPasswordValidator.Object, mockPasswordHasher.Object);

            var loginUserResult = await userController.LoginUser(userHelper.loginModel);
            Assert.NotNull(loginUserResult);
            UnauthorizedResult result = loginUserResult as UnauthorizedResult;
            Assert.NotNull(result);
            Assert.AreEqual(401, result.StatusCode);

        }


        [Test]
        public async Task TestLoginUser_Failed_Unauthorized2()
        {
            mockUserManager.Setup(x => x.FindByEmailAsync(userHelper.user.Email))
              .Returns(Task.FromResult(userHelper.user));
            mockUserManager.Setup(x => x.FindByNameAsync(userHelper.user.UserName))
               .Returns(Task.FromResult(userHelper.user));
            mockSignInManager.Setup(x => x.PasswordSignInAsync(It.IsAny<User>(), It.IsAny<string>(), It.IsAny<bool>(),
            It.IsAny<bool>())).Returns(Task.FromResult(SignInResult.Failed));
            mockSignInManager.Setup(x => x.SignOutAsync());
            userController = new UserController(mockUserManager.Object, mockSignInManager.Object, mockUserValidator.Object, mockPasswordValidator.Object, mockPasswordHasher.Object);

            var loginUserResult = await userController.LoginUser(userHelper.loginModel);
            Assert.NotNull(loginUserResult);
            UnauthorizedResult result = loginUserResult as UnauthorizedResult;
            Assert.NotNull(result);
            Assert.AreEqual(401, result.StatusCode);

        }

        [Test]
        public async Task TestLoginUser_Failed_BadRequest()
        {
            userController = new UserController(mockUserManager.Object, mockSignInManager.Object, mockUserValidator.Object, mockPasswordValidator.Object, mockPasswordHasher.Object);
            userController.ModelState.AddModelError("key", "error message");

            var loginUserResult = await userController.LoginUser(userHelper.loginModel);
            Assert.NotNull(loginUserResult);
            BadRequestResult result = loginUserResult as BadRequestResult;
            Assert.NotNull(result);
            Assert.AreEqual(400, result.StatusCode);

        }

        [Test]
        public async Task TestEditUser_Failed_NoContent()
        {
        
            userController = new UserController(mockUserManager.Object, mockSignInManager.Object, mockUserValidator.Object, mockPasswordValidator.Object, mockPasswordHasher.Object);

            var editUserResult = await userController.EditUser("", userHelper.editUserModel);
            Assert.NotNull(editUserResult);
            NoContentResult result = editUserResult as NoContentResult;
            Assert.NotNull(result);
            Assert.AreEqual(204, result.StatusCode);

        }
    }
}
