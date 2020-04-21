﻿using Microsoft.EntityFrameworkCore;
using SpaceDuck.Common.Models;

namespace SpaceDuck.KalamburyGame.DataBase
{
    public class ApplicationDataDbContext : DbContext
    {
        public ApplicationDataDbContext(DbContextOptions<ApplicationDataDbContext> options) : base(options) { }

        #region DbSets
        public DbSet<Ranking> Rankings { get; set; }

        public DbSet<Room> Rooms { get; set; }

        #endregion

        //protected override void OnModelCreating(ModelBuilder builder)
        //{
        //    base.OnModelCreating(builder);

        //    builder.Entity<RoomConfiguration>(entity =>
        //    entity.HasNoKey()
        //    );
        //}
    }
}
