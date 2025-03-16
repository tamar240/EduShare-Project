using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
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

    public async Task<string> UploadFileAsync(Stream fileStream, string fileName)
    {
        var request = new PutObjectRequest
        {
            BucketName = bucketName,
            Key = fileName,
            InputStream = fileStream,
            ContentType = "application/octet-stream",
            CannedACL = S3CannedACL.Private
        };

        await s3Client.PutObjectAsync(request);
        return $"https://{bucketName}.s3.amazonaws.com/{fileName}";
    }
}
