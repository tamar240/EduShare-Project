using EduShare.Core.Entities;
using EduShare.Core.Repositories;
using EduShare.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EduShare.Infrastructure.Repositories
{

    public class LessonRepository : ILessonRepository
    {
        private readonly DataContext _context;

        public LessonRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Lesson> AddAsync(Lesson lesson)
        {

            _context.Lessons.Add(lesson);
            await _context.SaveChangesAsync();
            return lesson;
        }

        public async Task<List<Lesson>> GetAllPublicLessonsAsyncBySubject(int userId, int subjectId)
        {
            var l = await _context.Lessons
                .Where(l => l.Permission == FileAccessTypeEnum.Public && l.OwnerId != userId && l.SubjectId == subjectId && !l.IsDeleted)
                .ToListAsync();

            return l;
        }

        public async Task<List<Lesson>> GetMyLessonsAsyncBySubject(int userId, int subjectId)
        {

            return await _context.Lessons
                .Where(l => l.OwnerId == userId && l.SubjectId == subjectId && !l.IsDeleted)
                .ToListAsync();
        }


        public async Task<List<Lesson>> GetAllLessonsBySubjectAsync(int subjectId)//admin
        {
            return await _context.Lessons.Where(l => l.SubjectId == subjectId && !l.IsDeleted).ToListAsync();
        }

        public async Task<Lesson> GetByIdAsync(int id, int userId)
        {
            var lesson = await _context.Lessons.FindAsync(id);

            if (lesson == null || lesson.IsDeleted)
                throw new KeyNotFoundException("this lesson not exist");

            if (lesson.Permission == FileAccessTypeEnum.Private && lesson.OwnerId != userId)
                throw new Exception("You are not the owner of this lesson");

            return lesson;
        }

        public async Task UpdateAsync(int id, Lesson lesson)
        {
            var currentLesson = await _context.Lessons.FindAsync(id);
            if (lesson == null || lesson.IsDeleted)
                throw new KeyNotFoundException("erorr in update lesson");

            currentLesson.Name = lesson.Name;
            currentLesson.UpdatedAt = DateTime.UtcNow;
            currentLesson.OrginalSummary = lesson.OrginalSummary;
            currentLesson.OrginalSummaryId = lesson.OrginalSummaryId;
            currentLesson.ProcessedSummary = lesson.ProcessedSummary;
            currentLesson.ProcessedSummaryId = lesson.ProcessedSummaryId;
        }

        public async Task DeleteAsync(int id)
        {
            var lesson = await _context.Lessons
                .Include(l => l.Files) 
                .FirstOrDefaultAsync(l => l.Id == id);

            if (lesson != null)
            {
                foreach (var file in lesson.Files)
                {
                    file.IsDeleted = true;
                }

                lesson.IsDeleted = true;
            }
        }


        public async Task UpdatePermissionAsync(int id, int userId)
        {
            var currentLesson = await _context.Lessons.FindAsync(id);

            if ( currentLesson.OwnerId != userId)
                throw new UnauthorizedAccessException("You do not have permission to modify this object.");

            var newPermission = currentLesson.Permission == FileAccessTypeEnum.Private ? FileAccessTypeEnum.Public : FileAccessTypeEnum.Private;

            currentLesson.Permission = newPermission;
            currentLesson.UpdatedAt = DateTime.UtcNow;

        }
        public async Task<LessonPermissionSummaryDto> GetLessonPermissionSummaryAsync()
        {
            var publicCount = await _context.Lessons.CountAsync(l => l.Permission == FileAccessTypeEnum.Public && !l.IsDeleted);
            var privateCount = await _context.Lessons.CountAsync(l => l.Permission == FileAccessTypeEnum.Private && !l.IsDeleted);

            return new LessonPermissionSummaryDto
            {
                PublicLessons = publicCount,
                PrivateLessons = privateCount
            };
        }
    }
}
