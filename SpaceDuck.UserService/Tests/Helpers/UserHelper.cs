using System;
using SpaceDuck.UserService.Models;

namespace Tests.Helpers
{
    public class UserHelper
    {
        public User user;
        public User userNewPassword;

        public LoginModel loginModel;
        public RegisterModel registerModel;
        public EditUserModel editUserModel;


        public UserHelper()
        {
            string name = "testName";
            string email = "test@test.test";
            string password = "Test1234!";
            string newPassword = "NewPassword";

            registerModel = new RegisterModel
            {
                Name = name,
                Email = email,
                Password = password
            };

            loginModel = new LoginModel {
                Name = name,
                Password = password
            };

            user = new User {
                UserName = name,
                Email = email,
            };

            userNewPassword = new User
            {
                UserName = name,
                Email = email,
            };

            editUserModel = new EditUserModel
            {
                NewPassword = newPassword
            };

        }
    }
}
