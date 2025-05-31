
using EduShare.Core.Entities;
using EduShare.Core.Repositories;
using EduShare.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduShare.Data
{
    public class UserRolesRepository : IUserRolesRepository
    {
        protected readonly DbSet<UserRoles> _dbSet;

        public UserRolesRepository(DataContext context)
        {
            _dbSet = context.UserRoles; 
        }

        public async Task<UserRoles> AddAsync(UserRoles userRole)
        {
            await _dbSet.AddAsync(userRole);
            return userRole;
        }

        public async Task DeleteAsync(int id)
        {
            var userRole = await GetByIdAsync(id);
            _dbSet.Remove(userRole);
        }

        public async Task<IEnumerable<UserRoles>> GetAllAsync()
        {
            return await _dbSet.Include(ur => ur.User).Include(ur => ur.Role).ToListAsync();
        }

        public async Task<UserRoles> GetByUserIdAsync(int id)
        {
            return await _dbSet.Include(ur => ur.User).Include(ur => ur.Role).FirstOrDefaultAsync(ur => ur.UserId == id);
        }
        public async Task<UserRoles> GetByIdAsync(int id)
        {
            return await _dbSet.Include(ur => ur.User).Include(ur => ur.Role).FirstOrDefaultAsync(ur => ur.Id == id);
        }
        public async Task<bool> UpdateAsync(int id, UserRoles userRole)
        {
            UserRoles existingUserRole = await GetByIdAsync(id);
            if (existingUserRole != null)
            {
                existingUserRole.UserId = userRole.UserId;
                existingUserRole.RoleId = userRole.RoleId;
                return true;
            }
            return false;
        }
    }
}
