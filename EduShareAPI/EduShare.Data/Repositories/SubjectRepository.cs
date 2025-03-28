using EduShare.Core.Entities;
using EduShare.Core.Repositories;
using EduShare.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EduShare.Infrastructure.Repositories
{
    public class SubjectRepository : ISubjectRepository
    {
        private readonly DataContext _context;
        private readonly LessonRepository _lessonRepository;

        public SubjectRepository(DataContext context, LessonRepository lessonRepository)
        {
            _context = context;
            _lessonRepository = lessonRepository;
        }

        public async Task<Subject> AddAsync(Subject subject)
        {

            await _context.Subjects.AddAsync(subject);
            return subject;
        }

        public async Task<List<Subject>> GetAllAsync(int userId)
        {
            return await _context.Subjects.Where(s => !s.IsDeleted && s.OwnerId == userId).ToListAsync();
        }
        public async Task<List<Subject>> GetAllMyAsync(int userId)
        {

            return await _context.Subjects.Where(s => !s.IsDeleted && s.OwnerId == userId).ToListAsync();
        }

        public async Task<Subject> GetByIdAsync(int id, int userId)
        {
            var subject = await _context.Subjects.FirstOrDefaultAsync(s => s.Id == id);


            if (subject == null || subject.IsDeleted)
                throw new KeyNotFoundException($"Subject with ID {id} was not found.");

            if (subject.OwnerId != userId)
                throw new UnauthorizedAccessException("You do not have permission to access this subject.");


            return subject;
        }
        public async Task<List<Subject>> GetPublicSubjectsAsync(int userId)
        {
            return await _context.Subjects
               .Where(s => s.AmountOfPublicLesson > 0 && s.OwnerId!=userId)
               .ToListAsync();

        }
        public async Task UpdateAsync(int id, Subject subject, int userId)
        {
            var currentSubject = await GetByIdAsync(id, userId);

            if (currentSubject == null || currentSubject.IsDeleted)
                throw new KeyNotFoundException($"Subject with ID {id} was not found.");

            currentSubject.UpdatedAt = DateTime.UtcNow;
            currentSubject.Name = subject.Name;
        }

        public async Task DeleteAsync(int id, int userId)
        {
            var subject = await _context.Subjects.FirstOrDefaultAsync(s => s.Id == id && s.OwnerId == userId);
            var lessons = await _context.Lessons.Where(l => l.SubjectId == id).ToListAsync();
            if (subject != null)
            {
                foreach (var lesson in lessons)
                {
                    await _lessonRepository.DeleteAsync(lesson.Id);
                }
                subject.IsDeleted = true;
            }
        }




    }
}
