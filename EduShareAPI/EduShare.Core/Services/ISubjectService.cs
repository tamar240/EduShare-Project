using System.Collections.Generic;
using System.Threading.Tasks;
using EduShare.Core.Entities;
using EduShare.Core.Repositories;

namespace EduShare.Core.Services
{
    public interface ISubjectService
    {

        Task<Subject> AddSubjectAsync(Subject subject,int userId);

        Task<List<Subject>> GetAllSubjectsAsync(int userId);
        Task<List<Subject>> GetAllMyAsync(int userId);
        
            Task<Subject> GetSubjectByIdAsync(int id, int userId);

        Task UpdateSubjectAsync(int id, Subject subject, int userId);

        Task DeleteSubjectAsync(int id, int userId);

        //Task<List<Lesson>> GetLessonsBySubjectAsync(int subjectId);//מיותר
        Task<List<Subject>> GetPublicSubjectsAsync(int userId);


    }
}
