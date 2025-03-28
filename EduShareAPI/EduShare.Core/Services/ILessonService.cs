using System.Collections.Generic;
using System.Threading.Tasks;
using EduShare.Core.Entities;

namespace EduShare.Core.Services
{
    public interface ILessonService
    {
        Task<Lesson> AddLessonAsync(Lesson lesson, int userId);
        Task<List<Lesson>> GetAllPublicLessonsAsyncBySubject(int subjectId, int userId);
        Task<List<Lesson>> GetMyLessonsAsyncBySubject(int subjectId, int userId);
        Task<List<Lesson>> GetAllLessonsBySubjectAsync(int subjectId);//admin
        Task<Lesson> GetByIdAsync(int id, int userId);
        Task UpdateAsync(int id, Lesson lesson, int userId);
        Task DeleteAsync(int id, int userId);
        Task UpdatePermissionAsync(int id, int userId);


    }
}
