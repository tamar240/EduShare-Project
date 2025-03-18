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
        public string FileType { get; set; } // pdf, docx וכו'

        [Required]
        public string FilePath { get; set; } // הנתיב לקובץ

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }

        public long Size { get; set; }

        [MaxLength(500)]
        public string S3Key { get; set; } // מפתח לקובץ ב-S3 אם רלוונטי

        [Required]
        public int LessonId { get; set; } // הקובץ שייך לשיעור

        //public virtual Lesson Lesson { get; set; }

        [Required]
        public int OwnerId { get; set; }
        //public virtual User Owner { get; set; }

        public bool IsDeleted { get; set; } = false;
    }
}
