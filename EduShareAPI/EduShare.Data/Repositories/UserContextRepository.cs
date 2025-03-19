//using EduShare.Core.Entities;
//using EduShare.Core.Repositories;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Security.Claims;
//using System.Text;
//using System.Threading.Tasks;


//namespace EduShare.Data.Repositories
//{
//    public class UserContextRepository : ControllerBase
//    {
//        private readonly IHttpContextAccessor _httpContextAccessor;
//        private readonly IUserRepository _userRepository;

//        public UserContextRepository(IHttpContextAccessor httpContextAccessor, IUserRepository userRepository)
//        {
//            _httpContextAccessor = httpContextAccessor;
//            _userRepository = userRepository;
//        }

//        public  int GetCurrentUserId()
//        {
//            var userName = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0";
//            var user =  _userRepository.GetUserByUsernameAsync(userName).Result;
            

//            if (user==null)
//                throw new UnauthorizedAccessException("User is not authenticated. :(");
//            return user.Id;

//        }

//        public async Task<User> GetCurrentUserAsync()
//        {
//            var userId = GetCurrentUserId();
//            return await _userRepository.GetUserByIdAsync(userId);
//        }


//    }

//}
////using EduShare.Core.Entities;
////using EduShare.Core.Repositories;
////using Microsoft.AspNetCore.Http;
////using System.Security.Claims;

////public class UserContextRepository
////{
////    private readonly IHttpContextAccessor _httpContextAccessor;
////    private readonly IUserRepository _userRepository;

////    public UserContextRepository(IHttpContextAccessor httpContextAccessor, IUserRepository userRepository)
////    {
////        _httpContextAccessor = httpContextAccessor;
////        _userRepository = userRepository;
////    }

////    public int GetCurrentUserId()
////    {

////        var user = _httpContextAccessor.HttpContext?.User; // השג את המשתמש מתוך הבקשה

////        if (user == null || !user.Identity.IsAuthenticated)
////        {
////            throw new UnauthorizedAccessException("User is not authenticated.");
////        }

////        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);

////        if (userIdClaim == null)
////        {
////            throw new UnauthorizedAccessException("User ID claim not found.");
////        }

////        return int.Parse(userIdClaim.Value);
////    }

////    public async Task<User> GetCurrentUserAsync()
////    {
////        var userId = GetCurrentUserId();
////        return await _userRepository.GetUserByIdAsync(userId);
////    }
////}

