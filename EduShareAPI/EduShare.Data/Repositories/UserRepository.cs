using EduShare.Core.Entities;
using EduShare.Core.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EduShare.Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context)
        {
            _context = context;
        }


        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                return null;
            }
            return user;
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                throw new KeyNotFoundException($"User with email {email} not found.");
            }
            return user;
        }



        public async Task<User> AddUserAsync(User user)
        {

            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
            {
                throw new InvalidOperationException("This email already exists.");
            }

            var u = await _context.Users.AddAsync(user);

            return user;
        }

        public async Task UpdateUserAsync(int id, User user)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (existingUser == null)
            {
                throw new KeyNotFoundException($"User with id {id} not found.");
            }

            existingUser.Name = user.Name;
            existingUser.Email = user.Email;

        }

        public async Task DeleteUserAsync(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                throw new KeyNotFoundException($"User with id {id} not found.");
            }

            user.IsDeleted = true;
        }

        public async Task<int[]> GetUsersPerMonthAsync()
        {
            // יוצר מערך בגודל 12 (לכל חודש בשנה)
            var usersPerMonth = new int[12];

            var users = await _context.Users
                .Where(u => !u.IsDeleted)
                .ToListAsync();

            foreach (var user in users)
            {
                if (user.CreatedAt.Year != DateTime.UtcNow.Year)
                    continue;

                int month = user.CreatedAt.Month - 1; 

                usersPerMonth[month]++;
            }

            return usersPerMonth;
        }
        public async Task<bool> HardDeleteUserAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return false;

            _context.Users.Remove(user);
            return true;
        }
    }
}
