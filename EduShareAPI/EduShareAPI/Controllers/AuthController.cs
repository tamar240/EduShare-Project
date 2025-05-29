using AutoMapper;
using EduShare.Core.Entities;
using EduShare.Core.EntitiesDTO;
using EduShare.Core.Services;
using EduShare.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/[controller]")]

public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly AuthService _authService;
    private readonly IUserService _userService;
    private readonly IMapper _mapper;
    public AuthController(IConfiguration configuration, AuthService authService, IUserService userService, IMapper mapper)
    {
        _configuration = configuration;
        _authService = authService;
        _userService = userService;
        _mapper = mapper;
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync([FromBody] LoginModel model)
    {
        var userRole = await _userService.GetUserByNameAndPassword(model.Name, model.Password);
        if (userRole != null )
        {
            var user=await _userService.GetUserByIdAsync(userRole.User.Id);
            if (user == null) {

                return Unauthorized();
            }
            if (userRole.Role.RoleName == "Admin")
            {
                var token = _authService.GenerateJwtToken(model.Name,userRole.User.Id,new[] { "Admin" });
                return Ok(new { Token = token, User = userRole.User });
            }
            else if (userRole.Role.RoleName == "Teacher")
            {
                var token = _authService.GenerateJwtToken(model.Name, userRole.User.Id,new[] { "Teacher" });
                return Ok(new { Token = token });
            }
      
            
        }
        return Unauthorized();
    }


  
    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync([FromBody] RegisterModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var modelD = _mapper.Map<UserDTO>(model);
        var existingUser = await _userService.AddAsync(modelD, model.RoleName);

        if (existingUser == null)
        {
            return Conflict("User already exists or could not be created.");
        }

        var token = _authService.GenerateJwtToken(model.Name, existingUser.Id, new[] { model.RoleName });
        return Ok(new { Token = token });
    }

}