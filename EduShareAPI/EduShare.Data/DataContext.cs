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
                .IsUnique();  // ייחודיות על האימייל


            modelBuilder.Entity<Lesson>()
                 .HasMany(l => l.Files) // קשר אחד-לרבים בין שיעור לקבצים
                 .WithOne() // לא מציינים את הישות, הקשר נעשה דרך ה-foreign key
                 .HasForeignKey(f => f.LessonId) // השדה LessonId ב-UploadedFile הוא המפתח הזר
                 .OnDelete(DeleteBehavior.Cascade); // אם השיעור נמחק, גם הקבצים יימחקו


            // קשר אחד-ליחיד בין Lesson ל-UploadedFile (סיכום)
            modelBuilder.Entity<Lesson>()
                .HasOne(l => l.Summary) // קשר בין שיעור לסיכום (UploadedFile אחד)
                .WithOne() // רק קובץ אחד (Summary) לשיעור
                .HasForeignKey<UploadedFile>(uf => uf.LessonId) // הגדרת LessonId כ-foreign key
                .OnDelete(DeleteBehavior.SetNull); // במידה והשיעור נמחק, לא למחוק את הסיכום (הגדרה לפי הצורך שלך)
        }
     

    }
}

