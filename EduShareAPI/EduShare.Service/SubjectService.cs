using System.Collections.Generic;
using System.Threading.Tasks;
using EduShare.Core.Entities;
using EduShare.Core.Repositories;

namespace EduShare.Core.Services
{
    public class SubjectService : ISubjectService
    {
        private readonly ISubjectRepository _subjectRepository;
        private readonly ILessonService _lessonService;
        private readonly IManagerRepository _managerRepository;

        public SubjectService(ISubjectRepository subjectRepository, ILessonService lessonService, IManagerRepository managerRepository)
        {
            _subjectRepository = subjectRepository;
            _lessonService = lessonService;
            _managerRepository = managerRepository;
        }

        public async Task<Subject> AddSubjectAsync(Subject subject)
        {
            
            var newSubject=await _subjectRepository.AddAsync(subject);
            await _managerRepository.SaveAsync();
            return newSubject;

        }
        public async Task<List<Subject>> GetAllSubjectsAsync()
        {
            return await _subjectRepository.GetAllAsync();
        }

        public async Task<Subject> GetSubjectByIdAsync(int id)
        {
            return await _subjectRepository.GetByIdAsync(id);
        }

        public async Task UpdateSubjectAsync(int id,Subject subject)
        {
            subject.UpdatedAt = DateTime.UtcNow;
            await _subjectRepository.UpdateAsync(id,subject);

            await _managerRepository.SaveAsync();
        }

        public async Task DeleteSubjectAsync(int id)
        {
            await _subjectRepository.DeleteAsync(id);
            await _managerRepository.SaveAsync();
        }
        public async Task<List<Lesson>> GetLessonsBySubjectAsync(int subjectId)
        {
            return await _lessonService.GetAllPublicLessonsAsyncBySubject(subjectId);
        }

    }
}
