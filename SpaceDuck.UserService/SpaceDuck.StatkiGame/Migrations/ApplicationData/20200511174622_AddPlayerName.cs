using Microsoft.EntityFrameworkCore.Migrations;

namespace SpaceDuck.ShipsGame.Migrations.ApplicationData
{
    public partial class AddPlayerName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PlayerOwnerName",
                table: "RoomConfiguration",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PlayerOwnerName",
                table: "RoomConfiguration");
        }
    }
}
