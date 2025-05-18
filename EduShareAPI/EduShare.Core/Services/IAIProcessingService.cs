using EduShare.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduShare.Core.Services
{

    public interface IAIProcessingService
    {
        Task<UploadedFile?> ProcessLessonSummaryAsync(
            UploadedFile originalFile,
            int lessonId,
            int userId,
            string accessToken);
    }

}
