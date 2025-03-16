using EduShare.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduShare.Core.Repositories
{
    public interface ILessonRepository
    {
        Task<Lesson> AddAsync(Lesson lesson);
        Task<List<Lesson>> GetAllBySubjectIdAsync(int subjectId);
        Task<Lesson> GetByIdAsync(int id);
        Task UpdateAsync(Lesson lesson);
        Task DeleteAsync(int id);
    }

}
