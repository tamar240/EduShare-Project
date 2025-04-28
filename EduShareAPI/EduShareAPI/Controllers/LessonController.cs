using AutoMapper;
using EduShare.Core.Entities;
using EduShare.Core.EntitiesDTO;
using EduShare.Core.Models;
using EduShare.Core.Services;
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

        public LessonController(ILessonService lessonService,IMapper mapper, IFileService fileService, S3Service s3Service)
        {
            _lessonService = lessonService;
            _mapper = mapper;
            _fileService = fileService;
            _s3Service = s3Service;
        }
        //נסיון קבלת קישור לקובץ שפייתון העלאה לAWS אבל פייתון לא הצליח
        //[HttpPost]
        //public async Task<IActionResult> AddLesson([FromBody] LessonWithFileDTO data)
        //{
        //    var lessonDTO = data.LessonDTO;
        //    var fileDTO = data.FileDTO;

        //    if (lessonDTO == null || fileDTO == null)
        //        return BadRequest("Invalid data.");

        //    var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

        //    var lesson = _mapper.Map<Lesson>(lessonDTO);
        //    lesson.OwnerId = userId;
        //    var newLesson = await _lessonService.AddLessonAsync(lesson,userId);

        //    var file = _mapper.Map<UploadedFile>(fileDTO);
        //    file.LessonId = newLesson.Id;
        //    var addedFile = await _fileService.AddFileAsync(file, userId);

        //    newLesson.OrginalSummary=addedFile;
        //    newLesson.OrginalSummaryId=addedFile.Id;



        //     return Ok();
        //}
        //[HttpPost]
        //public async Task<IActionResult> AddLesson([FromBody] LessonWithFileDTO data)
        //{
        //    var lessonDTO = data.LessonDTO;
        //    var fileDTO = data.FileDTO;

        //    if (lessonDTO == null || fileDTO == null)
        //        return BadRequest("Invalid data.");

        //    var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

        //    var lesson = _mapper.Map<Lesson>(lessonDTO);
        //    lesson.OwnerId = userId;
        //    var newLesson = await _lessonService.AddLessonAsync(lesson, userId);

        //    var file = _mapper.Map<UploadedFile>(fileDTO);
        //    file.LessonId = newLesson.Id;
        //    var addedFile = await _fileService.AddFileAsync(file, userId);

        //    newLesson.OrginalSummary = addedFile;
        //    newLesson.OrginalSummaryId = addedFile.Id;
        //    //עדכון השיעור
        //    // קריאה ל-AI
        //    try
        //    {
        //        using var httpClient = new HttpClient();
        //        var requestPayload = new { file_url = addedFile.FilePath };

        //        var json = JsonSerializer.Serialize(requestPayload);
        //        var content = new StringContent(json, Encoding.UTF8, "application/json");

        //        var pythonApiUrl = "http://127.0.0.1:8000/process-file";

        //        var response = await httpClient.PostAsync(pythonApiUrl, content);

        //        if (response.IsSuccessStatusCode)
        //        {
        //            var responseString = await response.Content.ReadAsStringAsync();
        //            var aiResult = JsonSerializer.Deserialize<AiSummaryResult>(responseString);

        //            // יוצרים UploadedFile חדש עבור הקובץ המעובד
        //            var processedFile = new UploadedFile
        //            {
        //                FileName = "AI_Summary_" + addedFile.FileName,
        //                FileType = "pdf",
        //                FilePath = aiResult.pdf_url, // מיקום הקובץ ב-AWS
        //                S3Key = aiResult.pdf_s3_key, // אם קיים
        //                LessonId = newLesson.Id,
        //                OwnerId = userId,
        //                Size = aiResult.size, // אם קיים
        //                UploadedAt = DateTime.Now,
        //                UpdatedAt = DateTime.Now,
        //                IsDeleted = false
        //            };

        //            var addedProcessedFile = await _fileService.AddFileAsync(processedFile, userId);

        //            newLesson.ProcessedSummary = addedProcessedFile;
        //            newLesson.ProcessedSummaryId = addedProcessedFile.Id;

        //            await _lessonService.UpdateAsync(lesson.Id,newLesson, userId);
        //        }
        //        else
        //        {
        //            Console.WriteLine($"AI API call failed: {response.StatusCode}");
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine($"Error calling AI service: {ex.Message}");
        //    }

        //    return Ok();
        //}
        //נסיון העלאה לAWS פה
        //[HttpPost]
        //public async Task<IActionResult> AddLesson([FromBody] LessonWithFileDTO data)
        //{
        //    var lessonDTO = data.LessonDTO;
        //    var fileDTO = data.FileDTO;

        //    if (lessonDTO == null || fileDTO == null)
        //        return BadRequest("Invalid data.");

        //    var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

        //    var lesson = _mapper.Map<Lesson>(lessonDTO);
        //    lesson.OwnerId = userId;
        //    var newLesson = await _lessonService.AddLessonAsync(lesson, userId);

        //    var file = _mapper.Map<UploadedFile>(fileDTO);
        //    file.LessonId = newLesson.Id;
        //    var addedFile = await _fileService.AddFileAsync(file, userId);

        //    newLesson.OrginalSummary = addedFile;
        //    newLesson.OrginalSummaryId = addedFile.Id;

        //    // הדפסת ה-URL לפני שליחה
        //    Console.WriteLine($"File URL sent to Python: {addedFile.FilePath}");

        //    // בדיקה בסיסית שה-FilePath נראה כמו URL
        //    if (!Uri.IsWellFormedUriString(addedFile.FilePath, UriKind.Absolute))
        //    {
        //        Console.WriteLine($"Warning: FilePath '{addedFile.FilePath}' does not appear to be a valid URL.");
        //        // ייתכן שכדאי להחזיר שגיאה כאן במקום לשלוח URL לא תקין לפייתון
        //        // return BadRequest("Invalid file URL.");
        //    }

        //    // קריאה ל-AI לקבלת קובץ PDF
        //    try
        //    {
        //        using var httpClient = new HttpClient();
        //        var requestPayload = new { file_url = addedFile.FilePath };

        //        var json = JsonSerializer.Serialize(requestPayload);
        //        var content = new StringContent(json, Encoding.UTF8, "application/json");

        //        var pythonApiUrl = "http://127.0.0.1:8000/process-file";

        //        var response = await httpClient.PostAsync(pythonApiUrl, content);

        //        if (response.IsSuccessStatusCode)
        //        {
        //            var pdfStream = await response.Content.ReadAsStreamAsync();
        //            var processedFileName = $"AI_Summary_{addedFile.FileName}";
        //            var contentType = "application/pdf"; // סוג התוכן של קובץ PDF

        //            // העלאת הקובץ המעובד ל-AWS באמצעות השירות שלך
        //            var s3Url = await _s3Service.UploadFileAsync(pdfStream, processedFileName, contentType, userId);

        //            // חילוץ מפתח ה-S3 מה-URL (אם הפורמט קבוע)
        //            string s3Key = null;
        //            if (!string.IsNullOrEmpty(s3Url) && s3Url.StartsWith($"https://edushare-files.s3.eu-north-1.amazonaws.com/"))
        //            {
        //                s3Key = s3Url.Substring($"https://edushare-files.s3.eu-north-1.amazonaws.com/".Length);
        //            }

        //            else if (!string.IsNullOrEmpty(s3Url))
        //            {
        //                var uri = new Uri(s3Url);

        //                // With this corrected line:  
        //                s3Key = uri.AbsolutePath.TrimStart('/');
        //            }

        //            // יוצרים UploadedFile חדש עבור הקובץ המעובד
        //            var processedFile = new UploadedFile
        //            {
        //                FileName = processedFileName,
        //                FileType = "pdf",
        //                FilePath = s3Url, // מיקום הקובץ ב-AWS
        //                S3Key = s3Key,
        //                LessonId = newLesson.Id,
        //                OwnerId = userId,
        //                Size = pdfStream.Length, // גודל הקובץ שהתקבל
        //                UploadedAt = DateTime.Now,
        //                UpdatedAt = DateTime.Now,
        //                IsDeleted = false
        //            };

        //            var addedProcessedFile = await _fileService.AddFileAsync(processedFile, userId);

        //            newLesson.ProcessedSummary = addedProcessedFile;
        //            newLesson.ProcessedSummaryId = addedProcessedFile.Id;

        //            await _lessonService.UpdateAsync(lesson.Id, newLesson, userId);
        //        }
        //        else
        //        {
        //            Console.WriteLine($"AI API call failed: {response.StatusCode}");
        //            // הדפס את תוכן השגיאה מהפייתון כדי לקבל פרטים נוספים
        //            var errorContent = await response.Content.ReadAsStringAsync();
        //            Console.WriteLine($"Python Error Content: {errorContent}");
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine($"Error calling AI service: {ex.Message}");
        //    }

        //    return Ok();
        //}
        //נסיון העלאה קובץ לAWS מפייתון עם שימוש בקונטרולר של השרת פה של OPLOADED
        [HttpPost]
        public async Task<IActionResult> AddLesson([FromBody] LessonWithFileDTO data)
        {
            var lessonDTO = data.LessonDTO;
            var fileDTO = data.FileDTO;

            if (lessonDTO == null || fileDTO == null)
                return BadRequest("Invalid data.");

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var token = await HttpContext.GetTokenAsync("access_token"); // שליפת הטוקן

            var lesson = _mapper.Map<Lesson>(lessonDTO);
            lesson.OwnerId = userId;
            var newLesson = await _lessonService.AddLessonAsync(lesson, userId);

            var file = _mapper.Map<UploadedFile>(fileDTO);
            file.LessonId = newLesson.Id;
            var addedFile = await _fileService.AddFileAsync(file, userId);

            newLesson.OrginalSummary = addedFile;
            newLesson.OrginalSummaryId = addedFile.Id;

            // הדפסת ה-URL לפני שליחה
            Console.WriteLine($"File URL sent to Python: {addedFile.FilePath}");

            if (!Uri.IsWellFormedUriString(addedFile.FilePath, UriKind.Absolute))
            {
                Console.WriteLine($"Warning: FilePath '{addedFile.FilePath}' does not appear to be a valid URL.");
            }

            try
            {

                using var httpClient = new HttpClient();
                var requestPayload = new
                {
                    file_url = addedFile.FilePath,
                    lesson_id = newLesson.Id.ToString()// כאן את שולחת גם את ה-ID של השיעור
                };
                var json = JsonSerializer.Serialize(requestPayload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var pythonApiUrl = "http://127.0.0.1:8000/process-file";

                // הוספת הטוקן ל-Authorization Header
                if (!string.IsNullOrEmpty(token))
                {
                    httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
                }

                var response = await httpClient.PostAsync(pythonApiUrl, content);

                if (response.IsSuccessStatusCode)
                {
                    var pdfStream = await response.Content.ReadAsStreamAsync();
                    using var memoryStream = new MemoryStream();
                    await pdfStream.CopyToAsync(memoryStream);



                    // יצירת קובץ חדש בבסיס הנתונים בלבד
                    var processedFile = new UploadedFile
                    {
                        FileName = $"lessonId_{newLesson.Id}_summary",
                        FileType = "pdf",
                        FilePath = "", 
                        S3Key = null,
                        LessonId = newLesson.Id,
                        OwnerId = userId,
                        Size = memoryStream.Length,
                        UploadedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now,
                        IsDeleted = false,
                        //Content = memoryStream.ToArray() // נוסיף את הקובץ עצמו לתוך השדה DB אם תרצה
                    };

                    var addedProcessedFile = await _fileService.AddFileAsync(processedFile, userId);

                    newLesson.ProcessedSummary = addedProcessedFile;
                    newLesson.ProcessedSummaryId = addedProcessedFile.Id;

                    await _lessonService.UpdateAsync(lesson.Id, newLesson, userId);
                }
                else
                {
                    Console.WriteLine($"AI API call failed: {response.StatusCode}");
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Python Error Content: {errorContent}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error calling AI service: {ex.Message}");
            }

            return Ok();
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
