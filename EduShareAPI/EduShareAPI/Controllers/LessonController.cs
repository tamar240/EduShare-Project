using AutoMapper;
using EduShare.Core.Entities;
using EduShare.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace EduShare.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize] // כל הפעולות דורשות התחברות
    public class LessonController : ControllerBase
    {
        private readonly ILessonService _lessonService;
        private readonly IMapper _mapper;
        private string GetUserName() => User.FindFirst(ClaimTypes.Name)?.Value ??"0";

        public LessonController(ILessonService lessonService,IMapper mapper)
        {
            _lessonService = lessonService;
            _mapper = mapper;
        }

        [HttpPost]
        //[Authorize(Policy = "AdminOnly")] // גישה רק למנהלים
        public async Task<IActionResult> AddLesson([FromBody] LessonDTO lessonDTO)
        {
            var lesson=_mapper.Map<Lesson>(lessonDTO);
            var userName= GetUserName();

            var newLesson = await _lessonService.AddLessonAsync(lesson,userName);
             return Ok(newLesson);
        }

        [HttpGet("public/{subjectId}")]
        public async Task<ActionResult<List<Lesson>>> GetAllPublicLessonsBySubject(int subjectId)
        {
            var lessons = await _lessonService.GetAllPublicLessonsAsyncBySubject(subjectId);

            return Ok(_mapper.Map<List<LessonGetDTO>>(lessons));
        }

        [HttpGet("my/{subjectId}")]
        public async Task<ActionResult<List<Lesson>>> GetMyLessonsBySubject(int subjectId)
        {
            var lessons = await _lessonService.GetMyLessonsAsyncBySubject(subjectId);
            return Ok(_mapper.Map<List<LessonGetDTO>>(lessons));
        }

        [HttpGet("all-admin/{subjectId}")]
        [Authorize(Policy = "AdminOnly")] // גישה רק למנהלים
        public async Task<ActionResult<List<Lesson>>> GetAllLessonsBySubject(int subjectId)
        {
            var lessons = await _lessonService.GetAllLessonsBySubjectAsync(subjectId);
          return Ok(_mapper.Map<List<LessonGetDTO>>(lessons));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Lesson>> GetById(int id)
        {
            var lesson = await _lessonService.GetByIdAsync(id);
            if (lesson == null)
                return NotFound();

            return Ok(_mapper.Map<LessonGetDTO>(lesson));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLesson(int id, [FromBody] LessonDTO lessonDTO)
        {
            var lesson = _mapper.Map<Lesson>(lessonDTO);
            try
            {
                await _lessonService.UpdateAsync(id, lesson);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLesson(int id)
        {
            try
            {
                await _lessonService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
