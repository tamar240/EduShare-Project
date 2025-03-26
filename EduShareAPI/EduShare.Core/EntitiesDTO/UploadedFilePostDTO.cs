using EduShare.Core.Entities;
using System;
using System.ComponentModel.DataAnnotations;

namespace EduShare.Core.EntitiesDTO
{
    public class UploadedFilePostDTO
    {
        [Required, MaxLength(255)]
        public string FileName { get; set; } 

        [Required]
        public string FileType { get; set; } // סוג הקובץ, לדוגמה: pdf, docx וכו'

        [Required]
        public string FilePath { get; set; } // מיקום הקובץ ב-S3 (יכול להיות URL או Path)

        public long Size { get; set; } // גודל הקובץ (ב-BYTES)

        [Required]
        public int LessonId { get; set; } // שיעור אליו הקובץ שייך

       

    }
}
