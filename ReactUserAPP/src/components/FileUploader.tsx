import React, { useState } from 'react';
import axios from 'axios';

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      // שלב 1: בקשה ל-Presigned URL מהשרת
      const response = await axios.get('https://localhost:7249/api/file/generate-presigned-url', {
        params: { fileName: file.name }
      });

      const presignedUrl = response.data.url;
      setUploadUrl(presignedUrl);

      // שלב 2: העלאת הקובץ ישירות ל-S3
      await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type,
          'x-amz-acl': 'private'
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setProgress(percent);
        },
      });
      

      alert('✅ הקובץ הועלה בהצלחה!');
    } catch (error) {
      console.error('❌ שגיאה בהעלאה:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file}>📤 העלה קובץ</button>
      {progress > 0 && <div>🔄 התקדמות: {progress}%</div>}
      {uploadUrl && <div>📂 קובץ הועלה ל-S3: <a href={uploadUrl} target="_blank" rel="noopener noreferrer">🔗 פתח</a></div>}
    </div>
  );
};

export default FileUploader;
