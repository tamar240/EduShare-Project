using Amazon.S3;
using Amazon.S3.Model;
using EduShare.Core.Entities;
using EduShare.Core.Models;
using EduShare.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace EduShareAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IAmazonS3 _s3Client;
        private readonly DataContext _context;  
        public FileController(IAmazonS3 s3Client, DataContext context)
        {
            _s3Client = s3Client;
            _context = context;  
        }

        [HttpGet("generate-presigned-url")]
        public async Task<IActionResult> GeneratePresignedUrl([FromQuery] string fileName)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = "your-bucket-name",  // שם ה-Bucket שלך
                Key = fileName,
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(15),
                ContentType = "application/octet-stream"  // עדכון לפי סוג הקובץ
            };

            string presignedUrl = _s3Client.GetPreSignedURL(request);
            return Ok(new { url = presignedUrl });
        }

        [HttpPost("upload-file")]
        public async Task<IActionResult> UploadFile([FromBody] UploadedFile file)
        {
            if (file == null)
                return BadRequest("Invalid file data.");

            // הוספת הקובץ למסד הנתונים
            _context.Files.Add(file);
            await _context.SaveChangesAsync();

            return Ok(file);
        }
    }
}
