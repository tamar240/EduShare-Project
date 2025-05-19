using EduShare.Core.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EduShare.Core.Entities
{
    public class Lesson
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(40)]

        public string Name { get; set; }

        //public Subject Subject { get; set; }//
        [ForeignKey("Subject")]
        public int SubjectId { get; set; }

        [ForeignKey("User")]

        public int OwnerId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public FileAccessTypeEnum Permission { get; set; } = FileAccessTypeEnum.Private;
        public bool IsDeleted { get; set; } = false;

        public int OrginalSummaryId { get; set; }

        [ForeignKey("OrginalSummaryId")]
        public UploadedFile OrginalSummary { get; set; }

        public int? ProcessedSummaryId { get; set; }

        [ForeignKey("ProcessedSummaryId")]
        public UploadedFile ProcessedSummary { get; set; }
        // כל שיעור יכיל רשימה של קבצים
        public virtual ICollection<UploadedFile> Files { get; set; } = new List<UploadedFile>();
    }
}
