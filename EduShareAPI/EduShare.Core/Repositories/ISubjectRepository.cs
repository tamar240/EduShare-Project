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
        Task<List<Subject>> GetAllAsync();
        Task<List<Subject>> GetAllMyAsync(int userId);
        Task<Subject> GetByIdAsync(int id);

        Task UpdateAsync(int id, Subject subject);
        Task DeleteAsync(int id);
    }

}
