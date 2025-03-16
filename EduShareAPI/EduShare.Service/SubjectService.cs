using System.Collections.Generic;
using System.Threading.Tasks;
using EduShare.Core.Entities;
using EduShare.Core.Repositories;

namespace EduShare.Core.Services
{
    public class SubjectService : ISubjectService
    {
        private readonly ISubjectRepository _subjectRepository;

        public SubjectService(ISubjectRepository subjectRepository)
        {
            _subjectRepository = subjectRepository;
        }

        public async Task<Subject> AddSubjectAsync(Subject subject)
        {
            return await _subjectRepository.AddAsync(subject);
        }

        public async Task<List<Subject>> GetAllSubjectsAsync()
        {
            return await _subjectRepository.GetAllAsync();
        }

        public async Task<Subject> GetSubjectByIdAsync(int id)
        {
            return await _subjectRepository.GetByIdAsync(id);
        }

        public async Task UpdateSubjectAsync(Subject subject)
        {
            await _subjectRepository.UpdateAsync(subject);
        }

        public async Task DeleteSubjectAsync(int id)
        {
            await _subjectRepository.DeleteAsync(id);
        }
        public async Task<List<Lesson>> GetLessonsBySubjectAsync(int subjectId, int userId)
        {
            return await _subjectRepository.GetLessonsBySubjectAsync(subjectId,userId);
        }

    }
}
