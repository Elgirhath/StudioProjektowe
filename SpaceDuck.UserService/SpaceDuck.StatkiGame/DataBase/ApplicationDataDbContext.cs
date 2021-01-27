using Microsoft.EntityFrameworkCore;
using SpaceDuck.Common.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace SpaceDuck.ShipsGame.DataBase
{
    public class ApplicationDataDbContext : DbContext
    {
        public ApplicationDataDbContext(DbContextOptions<ApplicationDataDbContext> options) : base(options) { }

        #region DbSets
        public DbSet<Ranking> Rankings { get; set; }

        public DbSet<Room> Rooms { get; set; }

        //public DbSet<RoomConfiguration> RoomConfigurations { get; set; }

        #endregion

        //protected override void OnModelCreating(ModelBuilder builder)
        //{
        //    base.OnModelCreating(builder);

        //    builder.Entity<RoomConfiguration>(entity =>
        //    entity.HasNoKey()
        //    );
        //}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure StudentId as FK for StudentAddress
            modelBuilder.Entity<Room>()
                .HasOne(r => r.RoomConfiguration)
                .WithOne(rc => rc.Room);
        }
    }
}
