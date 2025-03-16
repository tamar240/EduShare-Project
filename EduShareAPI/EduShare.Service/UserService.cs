using AutoMapper;
using EduShare.Core.Entities;
using EduShare.Core.EntitiesDTO;
using EduShare.Core.Repositories;
using EduShare.Core.Services;
using Org.BouncyCastle.Crypto.Generators;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EduShare.Service
{
    public class UserService : IUserService
    {
        private readonly IManagerRepository _managerRepository;
        private readonly IMapper _mapper;

        public UserService(IManagerRepository managerRepository, IMapper mapper)
        {
            _managerRepository = managerRepository;
            _mapper = mapper;
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _managerRepository.Users.GetAllUsersAsync();
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _managerRepository.Users.GetUserByIdAsync(id);
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _managerRepository.Users.GetUserByEmailAsync(email);
        }

        public async Task<List<User>> GetUsersByInstitutionAsync(string institutionCode)
        {
            return await _managerRepository.Users.GetUsersByInstitutionAsync(institutionCode);
        }

        public async Task<UserDTO> AddAsync(UserDTO user, string roleName)
        {
            var user2 = _mapper.Map<User>(user);
            if (await GetUserByIdAsync(user.Id) != null)
                return null;

            User u = await _managerRepository.Users.AddUserAsync(user2);

            if (u == null)
                return null;

            var role = await _managerRepository.Roles.GetIdByRoleAsync(roleName);
            var userRole = await _managerRepository.UserRoles.AddAsync(new UserRoles { Role = role, User = u });
            await _managerRepository.SaveAsync();
            var user3 = _mapper.Map<UserDTO>(u);
            return user3;
        }

        public async Task UpdateUserAsync(int id, User user)
        {
            await _managerRepository.Users.UpdateUserAsync(id, user);
            await _managerRepository.SaveAsync();
        }

        public async Task DeleteUserAsync(int id)
        {
            await _managerRepository.Users.DeleteUserAsync(id);
            await _managerRepository.SaveAsync();
        }
        public async Task<UserRoles?> GetUserByNameAndPassword(string username, string password)
        {
            // חיפוש המשתמש לפי שם המשתמש
            var users = await _managerRepository.Users.GetAllUsersAsync();
            var user = users.FirstOrDefault(u => u.Name == username &&
            u.Password == password);
            // אם לא נמצא משתמש או שהסיסמה שגויה
            if (user == null)
                return null;
            var role = _managerRepository.UserRoles.GetAllAsync().Result.FirstOrDefault(u => u.UserId == user.Id);
            return role;
        }
    }
}
