using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using EduShare.Core.Entities;
using EduShare.Core.Repositories;
using EduShare.Data.Repositories;
using EduShare.Service;
using Microsoft.EntityFrameworkCore;

namespace EduShare.Core.Services
{
    public class LessonService : ILessonService
    {

        private readonly ILessonRepository _lessonRepository;
        private readonly IManagerRepository _repositoryManager;
        private readonly IUserService _userService;

        public LessonService(ILessonRepository lessonRepository, IManagerRepository repositoryManager, IUserService userService)
        {
            _lessonRepository = lessonRepository;
            _repositoryManager = repositoryManager;
            _userService = userService;
        }

        public async Task<Lesson> AddLessonAsync(Lesson lesson, int userId)
        {
            lesson.OwnerId = userId;

            var newLesson = await _lessonRepository.AddAsync(lesson);

            if (lesson.Permission == FileAccessTypeEnum.Public)
                await UpdateCountOfPublicLessonInMySubject(lesson.SubjectId, userId, 1);

            //await _repositoryManager.SaveAsync();לא נשמור כדי שיהיה טרנזקציה - הוא ישמר רק בשמירה של הקובץ
            return newLesson;
        }

        public async Task<List<Lesson>> GetAllPublicLessonsAsyncBySubject(int subjectId, int userId)
        {

            return await _lessonRepository.GetAllPublicLessonsAsyncBySubject(userId, subjectId);
        }

        public async Task<List<Lesson>> GetMyLessonsAsyncBySubject(int subjectId, int userId)
        {

            return await _lessonRepository.GetMyLessonsAsyncBySubject(userId, subjectId);
        }

        public async Task<List<Lesson>> GetAllLessonsBySubjectAsync(int subjectId)//admin
        {
            return await _lessonRepository.GetAllLessonsBySubjectAsync(subjectId);
        }

        public async Task<Lesson> GetByIdAsync(int id, int userId)
        {
            return await _lessonRepository.GetByIdAsync(id, userId);
        }

        public async Task UpdateAsync(int id, Lesson lesson, int userId)
        {

            if (lesson.OwnerId != userId)
                throw new Exception("You are not the owner of this lesson");

            await _lessonRepository.UpdateAsync(id, lesson);
            await _repositoryManager.SaveAsync();
        }


        public async Task DeleteAsync(int id, int userId)
        {


            var lesson = await _lessonRepository.GetByIdAsync(id, userId);

            if (lesson != null && lesson.OwnerId != userId)
                throw new Exception("You are not the owner of this lesson");

            if (lesson == null)
                throw new Exception("Lesson not found");


            await _lessonRepository.DeleteAsync(id);

            if (lesson.Permission == FileAccessTypeEnum.Public)
                await UpdateCountOfPublicLessonInMySubject(lesson.SubjectId, userId, -1);
            await _repositoryManager.SaveAsync();
        }

        public async Task UpdatePermissionAsync(int id, int userId)
        {
            
            await _lessonRepository.UpdatePermissionAsync(id, userId);
            var lesson = await _lessonRepository.GetByIdAsync(id, userId);

            if (lesson.Permission == FileAccessTypeEnum.Public)
                await UpdateCountOfPublicLessonInMySubject(lesson.SubjectId, userId, 1);
            else
                await UpdateCountOfPublicLessonInMySubject(lesson.SubjectId, userId, -1);

            await _repositoryManager.SaveAsync();
        }

        private async Task UpdateCountOfPublicLessonInMySubject(int subjectId, int userId, int count)
        {
            var subject = await _repositoryManager.Subjects.GetByIdAsync(subjectId, userId);
            if (subject == null)
                throw new KeyNotFoundException("Subject not found");

            subject.AmountOfPublicLesson += count;
        }


    }
}

