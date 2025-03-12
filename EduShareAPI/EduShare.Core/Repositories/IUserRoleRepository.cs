using EduShare.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduShare.Core.Repositories
{
    public interface IUserRolesRepository
    {
        Task<UserRoles> AddAsync(UserRoles userRole);
        Task DeleteAsync(int id);
        Task<IEnumerable<UserRoles>> GetAllAsync();
        Task<UserRoles> GetByUserIdAsync(int id);
        public Task<UserRoles> GetByIdAsync(int id);
        Task<bool> UpdateAsync(int id, UserRoles userRole);
    }
}