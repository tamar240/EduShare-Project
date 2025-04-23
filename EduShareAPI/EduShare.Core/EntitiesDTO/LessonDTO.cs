using EduShare.Core.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EduShare.Core.Entities
{
    public class LessonDTO
    {
        [Required, MaxLength(40)]
        public string Name { get; set; }
        public int SubjectId { get; set; }
        public int? OwnerId { get; set; }

        public FileAccessTypeEnum Permission { get; set; } = FileAccessTypeEnum.Private;

    }
}
