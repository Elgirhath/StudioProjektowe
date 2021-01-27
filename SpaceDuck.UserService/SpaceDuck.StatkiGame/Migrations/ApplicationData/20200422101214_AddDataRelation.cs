using Microsoft.EntityFrameworkCore.Migrations;

namespace SpaceDuck.ShipsGame.Migrations.ApplicationData
{
    public partial class AddDataRelation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rooms_RoomConfiguration_RoomConfigurationid",
                table: "Rooms");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RoomConfiguration",
                table: "RoomConfiguration");

            migrationBuilder.RenameTable(
                name: "RoomConfiguration",
                newName: "RoomConfigurations");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RoomConfigurations",
                table: "RoomConfigurations",
                column: "RoomConfigurationid");

            migrationBuilder.AddForeignKey(
                name: "FK_Rooms_RoomConfigurations_RoomConfigurationid",
                table: "Rooms",
                column: "RoomConfigurationid",
                principalTable: "RoomConfigurations",
                principalColumn: "RoomConfigurationid",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rooms_RoomConfigurations_RoomConfigurationid",
                table: "Rooms");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RoomConfigurations",
                table: "RoomConfigurations");

            migrationBuilder.RenameTable(
                name: "RoomConfigurations",
                newName: "RoomConfiguration");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RoomConfiguration",
                table: "RoomConfiguration",
                column: "RoomConfigurationid");

            migrationBuilder.AddForeignKey(
                name: "FK_Rooms_RoomConfiguration_RoomConfigurationid",
                table: "Rooms",
                column: "RoomConfigurationid",
                principalTable: "RoomConfiguration",
                principalColumn: "RoomConfigurationid",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
