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

        public SubjectRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Subject> AddAsync(Subject subject)
        {

          await  _context.Subjects.AddAsync(subject);
            return subject;
        }

        public async Task<List<Subject>> GetAllAsync()
        {
            return await _context.Subjects.ToListAsync();
        }

        public async Task<Subject> GetByIdAsync(int id)
        {
            return await _context.Subjects.FindAsync(id);
        }

        public async Task UpdateAsync(int id,Subject subject)
        {
            var currentSubject = await GetByIdAsync(id);

            if(currentSubject==null)
                throw new KeyNotFoundException($"Subject with ID {id} was not found.");

            currentSubject.UpdatedAt = DateTime.UtcNow;
            currentSubject.Name = subject.Name;
        }

        public async Task DeleteAsync(int id)
        {
            var subject = await _context.Subjects.FindAsync(id);
            if (subject != null)
            {
                subject.IsDeleted = true;
            }
        }
        //public async Task<List<Lesson>> GetLessonsBySubjectAsync(int subjectId, int userId)
        //{
        //    var lessons = await _context.Lessons
        //        .Where(lesson => lesson.SubjectId == subjectId)
        //        .Where(lesson => lesson.Permission == FileAccessTypeEnum.Public ||
        //                        (lesson.Permission == FileAccessTypeEnum.Private && lesson.OwnerId == userId))
        //        .ToListAsync();

        //    return lessons;
        //}

    }
}
