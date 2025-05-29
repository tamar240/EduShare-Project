using EduShare.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduShare.Core.Repositories
{
    public interface ISubjectRepository
    {
        Task<Subject> AddAsync(Subject subject);
        Task<List<Subject>> GetAllAsync( int userId);
        Task<Subject> GetByIdAsync(int id, int userId);

        Task UpdateAsync(int id, Subject subject, int userId);
        Task DeleteAsync(int id, int userId);
        Task DeleteAllUserFilesAsync( int userId);
        Task<List<Subject>> GetPublicSubjectsAsync( int userId);

    }

}
