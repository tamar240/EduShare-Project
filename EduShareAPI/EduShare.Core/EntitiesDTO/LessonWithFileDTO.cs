using EduShare.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduShare.Core.EntitiesDTO
{
    public class LessonWithFileDTO
    {
        public LessonDTO LessonDTO { get; set; }
        public int FileId { get; set; } // רק ID
    }
}
