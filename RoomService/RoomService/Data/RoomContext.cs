using Microsoft.EntityFrameworkCore;
using RoomService.DTO;
using RoomService.Models;

namespace RoomService.Data
{
    public class RoomContext : DbContext
    {
        public DbSet<Room> Rooms { get; set; }
        public DbSet<RoomUser> RoomUsers { get; set; }

        public RoomContext(DbContextOptions<RoomContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<RoomUser>()
                .HasKey(ru => new { UserId = ru.userId, RoomId = ru.roomId }); // Clé primaire composite
            base.OnModelCreating(modelBuilder);
        }
        
    }
}
