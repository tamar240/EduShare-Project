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

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    base.OnModelCreating(modelBuilder);
        //}

    }
}

