using EduShare.Core.Entities;
using EduShare.Core.EntitiesDTO;
using EduShare.Core.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;
using EduShare.Core.Models;
using AutoMapper;
using Microsoft.VisualBasic.FileIO;
using Microsoft.EntityFrameworkCore;

namespace EduShare.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IFileService _fileService;
        private readonly IMapper _mapper;

        public FileController(IFileService fileService, IMapper mapper)
        {
            _fileService = fileService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var files = await _fileService.GetAllFiles();
            var filesDTO = _mapper.Map<IEnumerable<UploadedFileDTO>>(files);
            return Ok(filesDTO);
        }

        //[HttpGet("{id}")]
        //public async Task<ActionResult> Get(int id)
        //{
        //    try
        //    {
        //        var file = await _fileService.GetFileById(id);
        //        return Ok(_mapper.Map<UploadedFileDTO>(file));
        //    }
        //    catch (KeyNotFoundException ex)
        //    {
        //        return NotFound(new { message = ex.Message });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new { message = "An unexpected error occurred.", details = ex.Message });
        //    }
        //}

        [HttpGet("{fileId}")]
        public async Task<IActionResult> GetFile(int fileId)
        {
            //var userId = await _fileService.GetFileById(fileId); // קבלת המזהה של המשתמש המחובר
            //var user = await _context.Users.FindAsync(userId);

            //var file = await _context.Files
            //    .Include(f => f.Owner)
            //    .Include(f => f.Institution)
            //    .FirstOrDefaultAsync(f => f.Id == fileId);

            //if (file == null)
            //    return NotFound("File not found.");

            //// אם הקובץ ציבורי – כולם יכולים לגשת אליו
            //if (file.Visibility == "public")
            //    return Ok(file);

            //// אם הקובץ פרטי – רק המשתמש שהעלה אותו יכול לראות אותו
            //if (file.Visibility == "private" && file.OwnerId == userId)
            //    return Ok(file);

            //// אם הקובץ מוסדי – רק משתמשים מאותו מוסד יכולים לראות
            //if (file.Visibility == "institution" && file.InstitutionId == user.InstitutionId)
            //    return Ok(file);

            return Forbid(); // גישה לא מורשית
        }


        [HttpPost("upload")]
        public async Task<ActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            try
            {
                // נתיב מוחלט שבו יישמרו הקבצים
                var uploadsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");

                // אם תיקיית uploads לא קיימת, צור אותה
                if (!Directory.Exists(uploadsDirectory))
                {
                    Directory.CreateDirectory(uploadsDirectory);
                }

                var filePath = Path.Combine(uploadsDirectory, file.FileName);

                // שמירה על הקובץ
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // הוספת פרטי הקובץ למסד הנתונים
                var fileEntity = new UploadedFile
                {
                    UserId=3,
                    FileName = file.FileName,
                    FilePath = filePath,
                    UploadedAt = DateTime.Now,
                    FileType = string.IsNullOrEmpty(Path.GetExtension(file.FileName)) ? "unknown" : Path.GetExtension(file.FileName)
                };

                await _fileService.AddFile(fileEntity);

                return Ok(new { message = "File uploaded successfully.", filePath });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while uploading the file.", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFile(int id, [FromBody] UploadedFile file)
        {
            try
            {
                await _fileService.UpdateFile(id, file);
                return NoContent(); 
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        // פעולה למחיקת קובץ
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                await _fileService.DeleteFile(id);
                return Ok(new { message = "File deleted successfully." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the file.", details = ex.Message });
            }
        }
    }
}
