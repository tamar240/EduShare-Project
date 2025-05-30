﻿using EduShare.Core.Entities;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EduShare.Core.EntitiesDTO
{
    public class UploadedFileDTO
    {
        [Required, MaxLength(255)]
        public string FileName { get; set; } 

        [Required]
        public string FileType { get; set; } // סוג הקובץ, לדוגמה: pdf, docx וכו'

        [Required]
        public string FilePath { get; set; } // מיקום הקובץ ב-S3 (יכול להיות URL או Path)

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow; // תאריך העלאת הקובץ
        public DateTime UpdatedAt { get; set; } // תאריך עדכון הקובץ

        public long Size { get; set; } // גודל הקובץ (ב-BYTES)

        [MaxLength(500)]
        public string S3Key { get; set; } // מפתח ה-S3 של הקובץ (הייחודי ב-S3)


        public int? LessonId { get; set; }  // זה ה-FK שלך
        public Lesson? Lesson { get; set; } // זה הניווט


        [Required]
        public int OwnerId { get; set; } // מזהה המורה שהעלה את הקובץ
        public virtual User Owner { get; set; } // קישור למורה

        public bool IsDeleted { get; set; } = false; // האם הקובץ נמחק
    }
}
