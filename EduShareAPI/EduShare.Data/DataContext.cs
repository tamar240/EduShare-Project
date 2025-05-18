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
        public DbSet<Roles> Roles { get; set; }
        public DbSet<UserRoles> UserRoles { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<Lesson> Lessons { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ייחודיות אימייל למשתמש
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Lesson>()
                .HasMany(l => l.Files)
                .WithOne(f => f.Lesson)
                .HasForeignKey(f => f.LessonId)
                .OnDelete(DeleteBehavior.NoAction);


            // קישור בין שיעור לסיכום המקורי
            modelBuilder.Entity<Lesson>()
                .HasOne(l => l.OrginalSummary)
                .WithMany()
                .HasForeignKey(l => l.OrginalSummaryId)
                .OnDelete(DeleteBehavior.Restrict);

            // קישור בין שיעור לסיכום המעובד (לא חובה שיהיה)
            modelBuilder.Entity<Lesson>()
                .HasOne(l => l.ProcessedSummary)
                .WithMany()
                .HasForeignKey(l => l.ProcessedSummaryId)
                .OnDelete(DeleteBehavior.Restrict);
        }




    }
}

