using EduShare.Core.Entities;
using EduShare.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace EduShare.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<UploadedFile> Files { get; set; }
        public DbSet<Institution> Institutions { get; set; }
        public DbSet<Roles> Roles { get; set; }
        public DbSet<UserRoles> UserRoles { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<Lesson> Lessons { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // להגדיר ייחודיות על השם והאימייל
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Name)
                .IsUnique();  // ייחודיות על השם

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();  // ייחודיות על האימייל
        }
    }
}

