using EduShare.Core.Entities;
using EduShare.Core.Repositories;
using EduShare.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduShare.Data.Repositories
{
    public class RoleRepository : IRoleRpository
    {
        protected readonly DbSet<Roles> _dbSet;

        public RoleRepository(DataContext context)
        {
            _dbSet = context.Roles;
        }

        public async Task<Roles> AddAsync(Roles role)
        {
            await _dbSet.AddAsync(role);
            role.CreatedAt = DateTime.UtcNow;

            return role;
        }

        public async Task DeleteAsync(int id)
        {
            var role = await GetRoleByIdAsync(id);
            _dbSet.Remove(role);
        }

        public async Task<IEnumerable<Roles>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task<Roles> GetRoleByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }
        public async Task<Roles> GetIdByRoleAsync(string role)
        {
            var r = await _dbSet.FirstOrDefaultAsync(r => r.RoleName == role);
            return r;
        }

        public async Task<bool> UpdateAsync(int id, Roles role)
        {
            Roles existingRole = await GetRoleByIdAsync(id);
            if (existingRole != null)
            {
                existingRole.RoleName = role.RoleName;
                existingRole.Description = role.Description;
                existingRole.UpdatedAt = DateTime.UtcNow;

                return true;
            }
            return false;
        }
    }
}
