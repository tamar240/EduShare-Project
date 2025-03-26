using AutoMapper;
using EduShare.Core.Entities;
using EduShare.Core.EntitiesDTO;
using EduShare.Core.Models;
using EduShare.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace EduShareAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UploadedFileController : ControllerBase
    {
        private readonly IFileService _fileService;
        private readonly IMapper _mapper;
        public UploadedFileController(IFileService fileService,IMapper mapper)
        {
            _fileService = fileService;
            _mapper = mapper;
        }

        // הוספת קובץ
        [HttpPost]
        public async Task<IActionResult> AddFileAsync([FromBody] UploadedFilePostDTO fileDTO)
        {
            if (fileDTO == null)
            {
                return BadRequest("Invalid file data.");
            }
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var file =_mapper.Map<UploadedFile>(fileDTO);

            var addedFile = await _fileService.AddFileAsync(file,userId);
            return Ok(addedFile);
        }

        // קבלת קובץ לפי ID
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetFilesByIdUserAsync(int id)
        {
            try
            {
                var file = await _fileService.GetFilesByUserIdAsync(id); // מערך של קבצים????? אמור להיות
                return Ok(file);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFileByIdAsync(int id)
        {
            try
            {
                var file = await _fileService.GetFileByIdAsync(id); // יש לתקן אם מדובר בקובץ לפי ID
                return Ok(file);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
        // קבלת כל הקבצים של משתמש מסוים
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetFilesByUserIdAsync(int userId)
        {
            var files = await _fileService.GetFilesByUserIdAsync(userId);
            return Ok(files);
        }

        // קבלת כל הקבצים של שיעור מסוים
        [HttpGet("lesson/{lessonId}")]
        public async Task<IActionResult> GetFilesByLessonIdAsync(int lessonId)
        {
            var files = await _fileService.GetFilesByLessonIdAsync(lessonId);
            return Ok(files);
        }

        // קבלת כל הקבצים
        [HttpGet]
        public async Task<IActionResult> GetAllFilesAsync()
        {
            var files = await _fileService.GetAllFilesAsync();
            return Ok(files);
        }

        // עדכון קובץ
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFileAsync(int id, [FromBody] UploadedFile updatedFile)
        {
            try
            {
                await _fileService.UpdateFileAsync(id, updatedFile);
                return NoContent(); // עדכון מוצלח
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        // מחיקת קובץ
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFileAsync(int id)
        {
            try
            {
                await _fileService.DeleteFileAsync(id);
                return NoContent(); // מחיקה מוצלחת
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
