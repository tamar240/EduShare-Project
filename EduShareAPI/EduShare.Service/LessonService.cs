using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using EduShare.Core.Entities;
using EduShare.Core.Repositories;
using EduShare.Data.Repositories;
using EduShare.Service;

namespace EduShare.Core.Services
{
    public class LessonService : ILessonService
    {

        private readonly ILessonRepository _lessonRepository;
        private readonly IManagerRepository _repositoryManager;
        //private readonly UserContextRepository _userContextRepository;//בעיה
        private readonly IUserService _userService;

        public LessonService(ILessonRepository lessonRepository, IManagerRepository repositoryManager, IUserService userService)
        {
            _lessonRepository = lessonRepository;
            _repositoryManager = repositoryManager;
            _userService = userService;
            //_userContextRepository = userContextRepository;
        }
        private int GetUserId()
        {
            //var n = ClaimTypes.Name;


            //var urlParts = ClaimTypes.Name.Split("/");
            //var userName = urlParts[urlParts.Length - 1];
            //return _userService.GetUserByNameAsync(userName).Result.Id;

            //var userId=int.Parse(ClaimTypes.NameIdentifier);

            var userId = 37;//delete!!!

            return userId;
        }
        public async Task<Lesson> AddLessonAsync(Lesson lesson, string userName)
        {
            //var id = GetUserId();

            lesson.OwnerId = GetUserId();

            var newLesson= await _lessonRepository.AddAsync(lesson);
            await  _repositoryManager.SaveAsync();
            return newLesson;
        }

        public async Task<List<Lesson>> GetAllPublicLessonsAsyncBySubject(int subjectId)
        {
            var userId = 37;//GetUserId()
            return await _lessonRepository.GetAllPublicLessonsAsyncBySubject(userId, subjectId);
        }

        public async Task<List<Lesson>> GetMyLessonsAsyncBySubject( int subjectId)
        {
            var userId = GetUserId();
            return await _lessonRepository.GetMyLessonsAsyncBySubject(userId, subjectId);
        }

        public async Task<List<Lesson>> GetAllLessonsBySubjectAsync(int subjectId)//admin
        {
            return await _lessonRepository.GetAllLessonsBySubjectAsync(subjectId);
        }

        public async Task<Lesson> GetByIdAsync(int id)
        {
            var userId = GetUserId();
            return await  _lessonRepository.GetByIdAsync(id,userId);
        }

        public async Task UpdateAsync(int id,Lesson lesson)
        {
            var userId = GetUserId();

            if (lesson.OwnerId != userId)
                throw new Exception("You are not the owner of this lesson");

            await _lessonRepository.UpdateAsync(id,lesson);
            await _repositoryManager.SaveAsync();
        }

        public async Task DeleteAsync(int id)
        {
          
            var userId =GetUserId();
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

