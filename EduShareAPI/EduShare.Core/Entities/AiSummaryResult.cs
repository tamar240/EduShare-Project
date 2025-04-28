using System;

namespace EduShare.Core.Entities
{
    public class AiSummaryResult
    {
        public string lesson_summary { get; set; }
        public string pdf_url { get; set; }
        public string pdf_s3_key { get; set; }
        public long size { get; set; }
    }
}
