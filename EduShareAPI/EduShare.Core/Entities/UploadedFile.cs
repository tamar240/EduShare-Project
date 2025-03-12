using EduShare.Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduShare.Core.Models
{
    public class UploadedFile
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }
        public string FilePath { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        // פרטיות הקובץ
        public FileAccessTypeEnum AccessType { get; set; } = FileAccessTypeEnum.Private;

        // קשר למשתמש שהעלה את הקובץ
        public int UserId { get; set; }

    }
}
