using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;

[ApiController]
[Route("api/file")]
public class FileController : ControllerBase
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;

    public FileController(IAmazonS3 s3Client, IConfiguration config)
    {
        _s3Client = s3Client;
        _bucketName = config["AWS:BucketName"];  // להגדיר ב-appsettings.json
    }

    [HttpGet("generate-presigned-url")]
    public IActionResult GeneratePresignedUrl([FromQuery] string fileName)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = fileName,
            Verb = HttpVerb.PUT,
            Expires = DateTime.UtcNow.AddMinutes(15),
            ContentType = "application/octet-stream"
        };

        string presignedUrl = _s3Client.GetPreSignedURL(request);
        return Ok(new { url = presignedUrl });
    }
}
