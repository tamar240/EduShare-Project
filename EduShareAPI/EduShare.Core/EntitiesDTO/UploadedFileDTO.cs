using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduShare.Core.EntitiesDTO
{
    public class UploadedFileDTO
    {
        public string FileName { get; set; }
        public string FileType { get; set; }
        public string FilePath { get; set; }
        public DateTime UploadedAt { get; set; }
        public int UserId { get; set; } // רק ה-UserId
    }
}
