using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduShare.Core.Entities
{

    public class LessonPermissionSummaryDto
    {
        public int PublicLessons { get; set; }
        public int PrivateLessons { get; set; }
    }


}
