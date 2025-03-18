using System.Collections.Generic;
using System.Threading.Tasks;
using EduShare.Core.Entities;
using EduShare.Core.Repositories;
using EduShare.Data.Repositories;

namespace EduShare.Core.Services
{
    public class LessonService : ILessonService
    {

        private readonly ILessonRepository _lessonRepository;
        private readonly IManagerRepository _repositoryManager;
        private readonly UserContextRepository _userContextRepository;//בעיה

        public LessonService(ILessonRepository lessonRepository, IManagerRepository repositoryManager,UserContextRepository userContextRepository)
        {
            _lessonRepository = lessonRepository;
            _repositoryManager = repositoryManager;
            _userContextRepository = userContextRepository;
        }

        public async Task<Lesson> AddLessonAsync(Lesson lesson)
        {
            lesson.OwnerId=_userContextRepository.GetCurrentUserId();
            var newLesson= await _lessonRepository.AddAsync(lesson);
            await  _repositoryManager.SaveAsync();
            return newLesson;
        }


        public async Task<List<Lesson>> GetAllPublicLessonsAsyncBySubject(int subjectId)
        {
            var userId =  _userContextRepository.GetCurrentUserId();
            return await _lessonRepository.GetAllPublicLessonsAsyncBySubject(userId, subjectId);
        }

        public async Task<List<Lesson>> GetMyLessonsAsyncBySubject( int subjectId)
        {
            var userId = _userContextRepository.GetCurrentUserId();
            return await _lessonRepository.GetMyLessonsAsyncBySubject(userId, subjectId);
        }

        public async Task<List<Lesson>> GetAllLessonsBySubjectAsync(int subjectId)//admin
        {
            return await _lessonRepository.GetAllLessonsBySubjectAsync(subjectId);
        }

        public async Task<Lesson> GetByIdAsync(int id)
        {
            var userId = _userContextRepository.GetCurrentUserId();
            return await _lessonRepository.GetByIdAsync(id,userId);
        }

        public async Task UpdateAsync(int id,Lesson lesson)
        {
            var userId = _userContextRepository.GetCurrentUserId();

            if(lesson.OwnerId != userId)
                throw new Exception("You are not the owner of this lesson");

            await _lessonRepository.UpdateAsync(lesson);
            await _repositoryManager.SaveAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var userId = _userContextRepository.GetCurrentUserId();
            var lesson = await _lessonRepository.GetByIdAsync(id, userId);
            if(lesson != null)
            {
                if (lesson.OwnerId != userId)
                    throw new Exception("You are not the owner of this lesson");

                throw new Exception("Lesson not found");
            }

            await _lessonRepository.DeleteAsync(id);
            await _repositoryManager.SaveAsync();
        }

  
    }
}

