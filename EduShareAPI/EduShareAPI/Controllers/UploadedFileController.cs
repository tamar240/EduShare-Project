using EduShare.Core.Entities;
using EduShare.Core.Models;
using EduShare.Core.Repositories;
using EduShare.Data;
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
        private readonly IFileRepository _fileRepository;

        public UploadedFileController(IFileRepository fileRepository)
        {
            _fileRepository = fileRepository;
        }

        // הוספת קובץ
        [HttpPost]
        public async Task<IActionResult> AddFileAsync([FromBody] UploadedFile file)
        {
            if (file == null)
            {
                return BadRequest("Invalid file data.");
            }

            var addedFile = await _fileRepository.AddAsync(file);
            return CreatedAtAction(nameof(GetFileByIdAsync), new { id = addedFile.Id }, addedFile);
        }

        // קבלת קובץ לפי ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFileByIdAsync(int id)
        {
            try
            {
                var file = await _fileRepository.GetFileByIdAsync(id);
                return Ok(file);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        // קבלת כל הקבצים של שיעור מסוים
        [HttpGet("lesson/{lessonId}")]
        public async Task<IActionResult> GetFilesByLessonIdAsync(int lessonId)
        {
            var files = await _fileRepository.GetFilesByLessonIdAsync(lessonId);
            return Ok(files);
        }

        // קבלת כל הקבצים
        [HttpGet]
        public async Task<IActionResult> GetAllFilesAsync()
        {
            var files = await _fileRepository.GetAllFilesAsync();
            return Ok(files);
        }

        // עדכון קובץ
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFileAsync(int id, [FromBody] UploadedFile updatedFile)
        {
            try
            {
                await _fileRepository.UpdateAsync(id, updatedFile);
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
                await _fileRepository.DeleteAsync(id);
                return NoContent(); // מחיקה מוצלחת
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
