using EduShare.Core.Entities;
using EduShare.Core.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;


namespace EduShare.Data.Repositories
{
    public class UserContextRepository:ControllerBase
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IUserRepository _userRepository;

        public UserContextRepository(IHttpContextAccessor httpContextAccessor,IUserRepository userRepository)
        {
            _httpContextAccessor = httpContextAccessor;
            _userRepository = userRepository;
        }

        public int GetCurrentUserId()
        {
            //var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            var userId = User.FindFirst(ClaimTypes.Name);

            if (userId == null) throw new UnauthorizedAccessException("User is not authenticated.");
            return int.Parse(userId.Value);

        }
        public async Task<User> GetCurrentUserAsync()
        {
            var userId = GetCurrentUserId();
            return await _userRepository.GetUserByIdAsync(userId);
        }


    }

}
