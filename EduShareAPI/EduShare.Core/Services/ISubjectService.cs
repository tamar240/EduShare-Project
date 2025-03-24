using System.Collections.Generic;
using System.Threading.Tasks;
using EduShare.Core.Entities;
using EduShare.Core.Repositories;

namespace EduShare.Core.Services
{
    public interface ISubjectService
    {

        Task<Subject> AddSubjectAsync(Subject subject);

        Task<List<Subject>> GetAllSubjectsAsync();
        Task<List<Subject>> GetAllMyAsync();
        
            Task<Subject> GetSubjectByIdAsync(int id);

        Task UpdateSubjectAsync(int id, Subject subject);

        Task DeleteSubjectAsync(int id);

        Task<List<Lesson>> GetLessonsBySubjectAsync(int subjectId);//מיותר
        Task<List<Subject>> GetPublicSubjectsAsync();


    }
}
