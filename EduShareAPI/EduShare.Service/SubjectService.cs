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

        public async Task<Subject> AddSubjectAsync(Subject subject)
        {

            var newSubject = await _subjectRepository.AddAsync(subject);
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
        public async Task<List<Subject>> GetAllMyAsync()
        {
            //var c = ClaimTypes.Name;
            //var c2 = ClaimTypes.NameIdentifier;

            //var userId = int.Parse(ClaimTypes.NameIdentifier);
            var userId = 37;//delete!!!
            return await _subjectRepository.GetAllMyAsync(userId);
        }
        //public async Task<List<Subject>> GetAllMyAsync()
        //{
        //    // 🔥 קבלת ה-UserId מה-Claims של המשתמש

        //    var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier);
        //    if (userIdClaim == null)
        //    {
        //        throw new UnauthorizedAccessException("User is not authenticated.");
        //    }

        //    int userId = int.Parse(userIdClaim.Value); // ✅ שליפת ה-ID של המשתמש
        //    return await _subjectRepository.GetAllMyAsync(userId);
        //}
        public async Task UpdateSubjectAsync(int id, Subject subject)
        {
            subject.UpdatedAt = DateTime.UtcNow;
            await _subjectRepository.UpdateAsync(id, subject);

            await _managerRepository.SaveAsync();
        }

        public async Task DeleteSubjectAsync(int id)
        {
            await _subjectRepository.DeleteAsync(id);
            await _managerRepository.SaveAsync();
        }
        public async Task<List<Lesson>> GetLessonsBySubjectAsync(int subjectId)//מיותר
        {
            return await _lessonService.GetAllPublicLessonsAsyncBySubject(subjectId);
        }
        public async Task<List<Subject>> GetPublicSubjectsAsync()
        {
            return await _subjectRepository.GetPublicSubjectsAsync();

        }

    }
}
