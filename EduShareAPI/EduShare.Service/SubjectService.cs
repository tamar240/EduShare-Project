using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using EduShare.Core.Entities;
using EduShare.Core.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace EduShare.Core.Services
{
    public class SubjectService : ISubjectService
    {
        private readonly ISubjectRepository _subjectRepository;
        private readonly ILessonService _lessonService;
        private readonly IManagerRepository _managerRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SubjectService(ISubjectRepository subjectRepository, ILessonService lessonService, IManagerRepository managerRepository, IHttpContextAccessor httpContextAccessor)
        {
            _subjectRepository = subjectRepository;
            _lessonService = lessonService;
            _managerRepository = managerRepository;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<Subject> AddSubjectAsync(Subject subject, int userId)
        {
            subject.OwnerId = userId;
            var newSubject = await _subjectRepository.AddAsync(subject);
            await _managerRepository.SaveAsync();
            return newSubject;

        }
        public async Task<List<Subject>> GetAllSubjectsAsync(int userId)
        {
            return await _subjectRepository.GetAllAsync(userId);
        }

        public async Task<Subject> GetSubjectByIdAsync(int id, int userId)
        {
            return await _subjectRepository.GetByIdAsync(id,userId);
        }
        public async Task<List<Subject>> GetAllMyAsync(int userId)
        {
            return await _subjectRepository.GetAllMyAsync(userId);
        }
       
        public async Task UpdateSubjectAsync(int id, Subject subject, int userId)
        {
            subject.UpdatedAt = DateTime.UtcNow;
            await _subjectRepository.UpdateAsync(id, subject, userId);

            await _managerRepository.SaveAsync();
        }

        public async Task DeleteSubjectAsync(int id, int userId)
        {
            await _subjectRepository.DeleteAsync(id, userId);
            await _managerRepository.SaveAsync();
        }
        //public async Task<List<Lesson>> GetLessonsBySubjectAsync(int subjectId)//מיותר
        //{
        //    return await _lessonService.GetAllPublicLessonsAsyncBySubject(subjectId);
        //}
        public async Task<List<Subject>> GetPublicSubjectsAsync(int userId)
        {
            return await _subjectRepository.GetPublicSubjectsAsync(userId);

        }

    }
}
