using EduShare.Core.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EduShare.Core.Entities
{
    public class Lesson
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(255)]
        public string Name { get; set; }

        public int SubjectId { get; set; }
        //public virtual Subject Subject { get; set; } // קישור למקצוע

        public int OwnerId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public FileAccessTypeEnum Permission { get; set; } = FileAccessTypeEnum.Private;

        public bool IsDeleted { get; set; } = false;


        // כל שיעור יכיל רשימה של קבצים
        public virtual ICollection<UploadedFile> Files { get; set; } = new List<UploadedFile>();
    }
}
