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
            _context.Subjects.Add(subject);
            await _context.SaveChangesAsync();
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

        public async Task UpdateAsync(Subject subject)
        {
            _context.Subjects.Update(subject);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var subject = await _context.Subjects.FindAsync(id);
            if (subject != null)
            {
                _context.Subjects.Remove(subject);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<List<Lesson>> GetLessonsBySubjectAsync(int subjectId, int userId)
        {
            var lessons = await _context.Lessons
                .Where(lesson => lesson.SubjectId == subjectId)
                .Where(lesson => lesson.AccessType == FileAccessTypeEnum.Public ||
                                (lesson.AccessType == FileAccessTypeEnum.Private && lesson.OwnerId == userId))
                .ToListAsync();

            return lessons;
        }

    }
}
