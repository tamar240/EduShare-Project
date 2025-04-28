using EduShare.Core.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EduShare.Core.Entities
{
    public class LessonGetDTO
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(40)]
        public string Name { get; set; }

        public int SubjectId { get; set; }

        public int OwnerId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public FileAccessTypeEnum Permission { get; set; } = FileAccessTypeEnum.Private;

        public int OrginalSummaryId { get; set; }

        [ForeignKey("OrginalSummaryId")]
        public UploadedFile OrginalSummary { get; set; }

        public int? ProcessedSummaryId { get; set; }

        [ForeignKey("ProcessedSummaryId")]
        public UploadedFile ProcessedSummary { get; set; }

    }
}
