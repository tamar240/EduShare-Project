using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/upload")]
public class UploadController : ControllerBase
{
    private readonly IAmazonS3 _s3Client;

    public UploadController(IAmazonS3 s3Client)
    {
        _s3Client = s3Client;
    }

    [HttpGet("presigned-url")]
    public async Task<IActionResult> GetPresignedUrl([FromQuery] string fileName)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = "your-bucket-name",  // תצטרך לשים כאן את שם ה-Bucket שלך
            Key = fileName,
            Verb = HttpVerb.PUT,
            Expires = DateTime.UtcNow.AddMinutes(5),
            ContentType = "image/jpeg"  // תעדכן לפי סוג הקובץ שאתה מעלה
        };

        string url = _s3Client.GetPreSignedURL(request);
        return Ok(new { url });
    }
}
