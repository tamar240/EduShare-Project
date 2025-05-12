using EduShare.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduShare.Core.Repositories
{
    public interface ILessonRepository
    {
        Task<Lesson> AddAsync(Lesson lesson);
        Task<List<Lesson>> GetAllPublicLessonsAsyncBySubject(int userId, int subjectId);
        Task<List<Lesson>> GetMyLessonsAsyncBySubject(int userId, int subjectId);
        Task<List<Lesson>> GetAllLessonsBySubjectAsync(int subjectId);//admin
        Task<Lesson> GetByIdAsync(int id,int userId);
        Task UpdateAsync(int id,Lesson lesson);
        Task DeleteAsync(int id);

        Task UpdatePermissionAsync(int id, int userId);

        Task<LessonPermissionSummaryDto> GetLessonPermissionSummaryAsync();


    }
}


