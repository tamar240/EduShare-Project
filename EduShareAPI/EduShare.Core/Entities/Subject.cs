using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EduShare.Core.Entities
{
    public class Subject
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(255)]
        public string Name { get; set; } // שם המקצוע

        public int OwnerId { get; set; }
        //public virtual User Owner { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public bool IsDeleted { get; set; } = false;

        // כל מקצוע יכיל רשימה של שיעורים
        public virtual ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
    }
}
