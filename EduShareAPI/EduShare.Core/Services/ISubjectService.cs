using System.Collections.Generic;
using System.Threading.Tasks;
using EduShare.Core.Entities;

namespace EduShare.Core.Services
{
    public interface ISubjectService
    {
        Task<Subject> AddSubjectAsync(Subject subject);
        Task<List<Subject>> GetAllSubjectsAsync();
        Task<Subject> GetSubjectByIdAsync(int id);
        Task UpdateSubjectAsync(Subject subject);
        Task DeleteSubjectAsync(int id);
        Task<List<Lesson>> GetLessonsBySubjectAsync(int subjectId, int userId);
        

    }
}
