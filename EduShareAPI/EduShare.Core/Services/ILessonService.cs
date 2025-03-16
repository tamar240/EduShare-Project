using System.Collections.Generic;
using System.Threading.Tasks;
using EduShare.Core.Entities;

namespace EduShare.Core.Services
{
    public interface ILessonService
    {
        Task<Lesson> AddLessonAsync(Lesson lesson);
        Task<List<Lesson>> GetLessonsBySubjectIdAsync(int subjectId);
        Task<Lesson> GetLessonByIdAsync(int id);
        Task UpdateLessonAsync(Lesson lesson);
        Task DeleteLessonAsync(int id);
    }
}
