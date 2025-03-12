﻿using EduShare.Core.Entities;
using EduShare.Core.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using EduShare.Core.EntitiesDTO;
using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Authorization;

namespace EduShare.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public UserController(IUserService userService,IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        [HttpGet("admin-only")]
        [Authorize(Policy = "AdminOnly")] // רק Admin יכול לגשת
        public async Task<ActionResult<List<User>>> GetAll()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetById(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }
            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult> AddUser([FromBody] UserPostDTO userDto)
        {
            var user=_mapper.Map<UserDTO>(userDto);


          var newUser=  await _userService.AddAsync(user,userDto.RoleName);
            if (newUser == null)
                return BadRequest();
            return Ok(newUser);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateUser(int id, [FromBody] User user)
        {
            var existingUser = await _userService.GetUserByIdAsync(id);
            if (existingUser == null)
            {
                return NotFound(new { message = "User not found." });
            }

            await _userService.UpdateUserAsync(id, user);
            return Ok(new { message = "User updated successfully." });
        }



        // פעולה למחיקת משתמש
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            await _userService.DeleteUserAsync(id);
            return Ok(new { message = "User deleted successfully." });
        }
    }
}
