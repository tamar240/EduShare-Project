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

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique(); // ייחודיות על האימייל

            modelBuilder.Entity<Lesson>()
                .HasMany(l => l.Files) // קשר אחד-לרבים בין שיעור לקבצים
                .WithOne() // אין נוויגציה מהקובץ בחזרה
                .HasForeignKey(f => f.LessonId)
                .OnDelete(DeleteBehavior.Cascade); // אם שיעור נמחק, גם הקבצים שלו יימחקו
        }



    }
}

