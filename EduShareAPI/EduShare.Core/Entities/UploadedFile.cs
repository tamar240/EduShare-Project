using EduShare.Core.Entities;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EduShare.Core.Models
{
    public class UploadedFile
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required, MaxLength(255)]
        public string FileName { get; set; }

        [Required]
        public string FileType { get; set; }

        [Required]
        public string FilePath { get; set; }

        public DateTime UploadedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public long Size { get; set; }

        [MaxLength(500)]
        public string? S3Key { get; set; }

        public int? LessonId { get; set; }  // זה ה-FK שלך
        [ForeignKey("LessonId")]
        public Lesson? Lesson { get; set; } // זה הניווט


        [Required]
        public int OwnerId { get; set; }

        public bool IsDeleted { get; set; } = false;
    }
}
