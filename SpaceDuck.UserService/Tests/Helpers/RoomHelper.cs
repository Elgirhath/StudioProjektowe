using System;
using System.Collections.Generic;
using SpaceDuck.Common.Models;

namespace Tests.Helpers
{
    public class RoomHelper
    {
        public Room roomKalambury;
        public Room roomChess;
        public Room roomShips;
        public Room roomChinese;
        public Room roomKalamburyOnePlayer;
        public Room roomChessOnePlayer;
        public Room roomShipsOnePlayer;
        public Room roomChineseOnePlayer;
        public Room roomKalamburyStarted;
        public Room roomChessStarted;
        public Room roomShipsStarted;
        public Room roomChineseStarted;
        public Player player;

        public RoomHelper()
        {
            List<Player> players = new List<Player>();
            List<Player> players2 = new List<Player>();

            player = new Player {
                Id = "id",
                Name = "name" };
            players.Add(player);
            players2.Add(player);

            players.Add(new Player { Id = "id2", Name = "name2" });


            roomKalambury = new Room {
                Id = 1,
                GameType = GameType.KalamburyGame,
                RoomConfigurationid = 1,
                Players = players2,
                IsFull = false
            };
            roomChess = new Room
            {
                Id = 2,
                GameType = GameType.ChessGame,
                RoomConfigurationid = 2,
                Players = players2,
                IsFull = false
            };
            roomShips = new Room
            {
                Id = 3,
                GameType = GameType.ShipsGame,
                RoomConfigurationid = 3,
                Players = players2,
                IsFull = false
            };
            roomChinese = new Room
            {
                Id = 4,
                GameType = GameType.ChineseGame,
                RoomConfigurationid = 4,
                Players = players2,
                IsFull = false
            };

            roomKalamburyOnePlayer = new Room
            {
                Id = 1,
                GameType = GameType.KalamburyGame,
                RoomConfigurationid = 1,
                Players = players2,
                IsFull = false
            };
            roomChessOnePlayer = new Room
            {
                Id = 2,
                GameType = GameType.ChessGame,
                RoomConfigurationid = 2,
                Players = players2,
                IsFull = false
            };
            roomShipsOnePlayer = new Room
            {
                Id = 3,
                GameType = GameType.ShipsGame,
                RoomConfigurationid = 3,
                Players = players2,
                IsFull = false
            };
            roomChineseOnePlayer = new Room
            {
                Id = 4,
                GameType = GameType.ChineseGame,
                RoomConfigurationid = 4,
                Players = players2,
                IsFull = false
            };


            roomKalamburyStarted= new Room
            {
                Id = 10,
                GameType = GameType.KalamburyGame,
                RoomConfigurationid = 1,
                Players = players,
                IsFull = false
            };
            roomChessStarted = new Room
            {
                Id = 20,
                GameType = GameType.ChessGame,
                RoomConfigurationid = 2,
                Players = players,
                IsFull = false
            };
            roomShipsStarted = new Room
            {
                Id = 30,
                GameType = GameType.ShipsGame,
                RoomConfigurationid = 3,
                Players = players,
                IsFull = false
            };
            roomChineseStarted = new Room
            {
                Id = 40,
                GameType = GameType.ChineseGame,
                RoomConfigurationid = 4,
                Players = players,
                IsFull = false
            };
        }
    }
}
