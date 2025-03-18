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
        if (userRole != null)
        {

            if (userRole.Role.RoleName == "Admin")
            {
                var token = _authService.GenerateJwtToken(model.Name, new[] { "Admin" });
                return Ok(new { Token = token, User = userRole.User });
            }
            else if (userRole.Role.RoleName == "Editor")
            {
                var token = _authService.GenerateJwtToken(model.Name, new[] { "Editor" });
                return Ok(new { Token = token });
            }
            else if (userRole.Role.RoleName == "Viewer")
            {
                var token = _authService.GenerateJwtToken(model.Name, new[] { "Viewer" });
                return Ok(new { Token = token });
            }
        }
        return Unauthorized();
    }


    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync([FromBody] RegisterModel model)
    {
        if (model == null)
        {
            return Conflict("User is not valid");
        }
        var modelD = _mapper.Map<UserDTO>(model);

        var existingUser =await  _userService.AddAsync(modelD,model.RoleName);
        if (existingUser == null)
            return BadRequest();
      
        var token = _authService.GenerateJwtToken(model.Name,new[] { model.RoleName });
        //add user and return it
        return Ok(new { Token = token });


    }
}