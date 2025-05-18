using AutoMapper;
using EduShare.Core.Entities;
using EduShare.Core.EntitiesDTO;
using EduShare.Core.Models;
using EduShare.Core.Services;
using EduShare.Service;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace EduShare.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // כל הפעולות דורשות התחברות
    public class LessonController : ControllerBase
    {
        private readonly ILessonService _lessonService;
        private readonly IFileService _fileService;
        private readonly S3Service  _s3Service;
        private readonly IMapper _mapper;
        private readonly IAIProcessingService _aiProcessingService;

        public LessonController(ILessonService lessonService,IMapper mapper, IFileService fileService, S3Service s3Service, IAIProcessingService aiProcessingService)
        {
            _lessonService = lessonService;
            _mapper = mapper;
            _fileService = fileService;
            _s3Service = s3Service;
            _aiProcessingService = aiProcessingService;
        }

        [HttpPost]
        public async Task<IActionResult> AddLesson([FromBody] LessonWithFileDTO data)
        {
            var lessonDTO = data.LessonDTO;
            var fileId = data.FileId;

            if (lessonDTO == null || fileId <= 0)
                return BadRequest("Invalid data.");

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var token = await HttpContext.GetTokenAsync("access_token");

            var lesson = _mapper.Map<Lesson>(lessonDTO);
            lesson.OwnerId = userId;
            var newLesson = await _lessonService.AddLessonAsync(lesson, userId);

            var originalFile = await _fileService.GetFileByIdAsync(fileId, userId);
            if (originalFile == null)
                return NotFound("Original file not found.");

            originalFile.LessonId = newLesson.Id;

            await _fileService.UpdateFileAsync(originalFile.Id, originalFile);

            
            newLesson.OrginalSummaryId = originalFile.Id;
            newLesson.OrginalSummary = originalFile;

            var processedFile = await _aiProcessingService.ProcessLessonSummaryAsync(originalFile, newLesson.Id, userId, token);

            if (processedFile != null)
            {
                newLesson.ProcessedSummary = processedFile;
                newLesson.ProcessedSummaryId = processedFile.Id;

            }
            await _lessonService.UpdateAsync(newLesson.Id, newLesson, userId);

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

        [HttpGet("permissions-summary")]
        public async Task<ActionResult<LessonPermissionSummaryDto>> GetPermissionsSummary()
        {
            var result = await _lessonService.GetLessonPermissionSummaryAsync();
            return Ok(result);
        }
    }
}
