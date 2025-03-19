using System.Collections.Generic;
using System.Threading.Tasks;
using EduShare.Core.Entities;

namespace EduShare.Core.Services
{
    public interface ILessonService
    {
        Task<Lesson> AddLessonAsync(Lesson lesson, string userName);
        Task<List<Lesson>> GetAllPublicLessonsAsyncBySubject (int subjectId);
        Task<List<Lesson>> GetMyLessonsAsyncBySubject( int subjectId);
        Task<List<Lesson>> GetAllLessonsBySubjectAsync(int subjectId);//admin
        Task<Lesson> GetByIdAsync(int id);
        Task UpdateAsync(int id,Lesson lesson);
        Task DeleteAsync(int id);

    }
}
