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

        [HttpGet("id/{id}")]
        public async Task<IActionResult> GetFileByIdAsync(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            try
            {
                var file = await _fileService.GetFileByIdAsync(id,userId); // יש לתקן אם מדובר בקובץ לפי ID
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
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var files = await _fileService.GetFilesByLessonIdAsync(lessonId,userId);
            return Ok(files);
        }

        // קבלת כל הקבצים
        [HttpGet]
        public async Task<IActionResult> GetAllFilesAsync()
        {
            var files = await _fileService.GetAllFilesAsync();
            return Ok(files);
        }

        [HttpGet("deleted")]
        public async Task<IActionResult> GetDeletedFilesAsync()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var deletedFiles = await _fileService.GetDeletedFilesByUserIdAsync(userId);
            return Ok(deletedFiles);
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

        [HttpDelete("hard-delete/{id}")]
        public async Task<IActionResult> HardDeleteFileAsync(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                await _fileService.HardDeleteFileAsync(id, userId);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest("error in delete file: " + ex.Message);
            }
        }
        [HttpPut("restore/{fileId}")]
        public async Task<IActionResult> RestoreFileAsync(int fileId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            try
            {
                await _fileService.RestoreDeletedFileAsync(fileId, userId);
                return NoContent(); // או 200 OK אם אתה רוצה לשלוח משהו חזרה
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

    }
}
