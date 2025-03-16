using EduShare.Core.Entities;
using EduShare.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EduShare.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectController : ControllerBase
    {
        private readonly DataContext _context;

        public SubjectController(DataContext context)
        {
            _context = context;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddSubject([FromBody] Subject subject)
        {
            if (subject == null)
                return BadRequest("Invalid subject data.");

            _context.Subjects.Add(subject);
            await _context.SaveChangesAsync();

            return Ok(subject);
        }

        [HttpGet]
        public async Task<IActionResult> GetSubjects()
        {
            var subjects = await _context.Subjects.ToListAsync();
            return Ok(subjects);
        }
    }

}
