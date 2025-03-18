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


        // מתודה שמחזירה את כל השעורים ה- PUBLIC, מלבד השעורים של המשתמש
        public async Task<List<Lesson>> GetAllPublicLessonsAsyncBySubject(int userId,int  subjectId)
        {
            return await _context.Lessons
                .Where(l => l.Permission == FileAccessTypeEnum.Public && l.OwnerId != userId && l.SubjectId == subjectId)
                .ToListAsync();
        }

        // מתודה שמחזירה את השעורים של המשתמש
        public async Task<List<Lesson>> GetMyLessonsAsyncBySubject(int userId,int subjectId)
        {
            return await _context.Lessons
                .Where(l => l.OwnerId == userId && l.SubjectId==subjectId)
                .ToListAsync();
        }


        public async Task<List<Lesson>> GetAllLessonsBySubjectAsync(int subjectId)//admin
        {
            return await _context.Lessons.Where(l => l.SubjectId == subjectId).ToListAsync();
        }

        public async Task<Lesson> GetByIdAsync(int id, int userId)
        {
           var lesson= await _context.Lessons.FindAsync(id);

            if (lesson.OwnerId != userId)
                throw new System.Exception("You are not the owner of this lesson");
            return lesson;
        }

        public async Task UpdateAsync(Lesson lesson)
        {
            _context.Lessons.Update(lesson);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var lesson = await _context.Lessons.FindAsync(id);
            if (lesson != null)
            {
                _context.Lessons.Remove(lesson);
                await _context.SaveChangesAsync();
            }
        }

       
    }
}
