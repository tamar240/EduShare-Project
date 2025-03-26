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
    [Authorize] // כל הפעולות דורשות התחברות
    public class LessonController : ControllerBase
    {
        private readonly ILessonService _lessonService;
        private readonly IMapper _mapper;

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
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var newLesson = await _lessonService.AddLessonAsync(lesson,userId);
             return Ok(newLesson);
        }

        [HttpGet("public/{subjectId}")]
        public async Task<ActionResult<List<Lesson>>> GetAllPublicLessonsBySubject(int subjectId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var lessons = await _lessonService.GetAllPublicLessonsAsyncBySubject(subjectId,userId);

            return Ok(_mapper.Map<List<LessonGetDTO>>(lessons));
        }

        [HttpGet("my/{subjectId}")]
        public async Task<ActionResult<List<Lesson>>> GetMyLessonsBySubject(int subjectId)
        {

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var lessons = await _lessonService.GetMyLessonsAsyncBySubject(subjectId,userId);
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
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var lesson = await _lessonService.GetByIdAsync(id,userId);
            if (lesson == null)
                return NotFound();

            return Ok(_mapper.Map<LessonGetDTO>(lesson));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLesson(int id, [FromBody] LessonDTO lessonDTO)
        {
            var lesson = _mapper.Map<Lesson>(lessonDTO);
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            try
            {
                await _lessonService.UpdateAsync(id, lesson,userId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPut("permission/{id}")]
        public async Task<IActionResult> UpdateLessonPermission(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            try
            {
                await _lessonService.UpdatePermissionAsync(id,userId);
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
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            try
            {
                await _lessonService.DeleteAsync(id,userId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
