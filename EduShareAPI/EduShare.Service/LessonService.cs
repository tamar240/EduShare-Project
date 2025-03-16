using System.Collections.Generic;
using System.Threading.Tasks;
using EduShare.Core.Entities;
using EduShare.Core.Repositories;

namespace EduShare.Core.Services
{
    public class LessonService : ILessonService
    {
        private readonly ILessonRepository _lessonRepository;

        public LessonService(ILessonRepository lessonRepository)
        {
            _lessonRepository = lessonRepository;
        }

        public async Task<Lesson> AddLessonAsync(Lesson lesson)
        {
            return await _lessonRepository.AddAsync(lesson);
        }

        public async Task<List<Lesson>> GetLessonsBySubjectIdAsync(int subjectId)
        {
            return await _lessonRepository.GetAllBySubjectIdAsync(subjectId);
        }

        public async Task<Lesson> GetLessonByIdAsync(int id)
        {
            return await _lessonRepository.GetByIdAsync(id);
        }

        public async Task UpdateLessonAsync(Lesson lesson)
        {
            await _lessonRepository.UpdateAsync(lesson);
        }

        public async Task DeleteLessonAsync(int id)
        {
            await _lessonRepository.DeleteAsync(id);
        }
    }
}
