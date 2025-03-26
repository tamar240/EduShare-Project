using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Threading.Tasks;

public class S3Service
{
    private readonly string bucketName;
    private readonly IAmazonS3 s3Client;

    public S3Service(IConfiguration config)
    {
        bucketName = config["AWS:BucketName"];
        s3Client = new AmazonS3Client(
            config["AWS:AccessKey"],
            config["AWS:SecretKey"],
            RegionEndpoint.GetBySystemName(config["AWS:Region"])
        );
    }

    public async Task<string> UploadFileAsync(Stream fileStream, string fileName,string contentType,int userId)
    {
        var request = new PutObjectRequest
        {
            BucketName = bucketName,
            Key = $"{userId}/{fileName}",
            InputStream = fileStream,
            ContentType = contentType,

            CannedACL = S3CannedACL.Private
        };

        await s3Client.PutObjectAsync(request);
        return $"https://{bucketName}.s3.amazonaws.com/{fileName}";
    }

    public async Task<string> GetDownloadUrlAsync(string userId, string fileName)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = "edushare-files",
            Key = fileName,
            Verb = HttpVerb.GET,
            Expires = DateTime.UtcNow.AddDays(7),
        };

        return await s3Client.GetPreSignedURLAsync(request);
    }
}
