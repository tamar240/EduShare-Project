using EduShare.Core.Entities;
using EduShare.Core.Models;
using EduShare.Core.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EduShareAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadedFileController : ControllerBase
    {
        private readonly IFileService _fileService;
        public UploadedFileController(IFileService fileService)
        {
            _fileService = fileService;
        }

        // הוספת קובץ
        [HttpPost]
        public async Task<IActionResult> AddFileAsync([FromBody] UploadedFile file)
        {
            if (file == null)
            {
                return BadRequest("Invalid file data.");
            }

            var addedFile = await _fileService.AddFileAsync(file);
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
