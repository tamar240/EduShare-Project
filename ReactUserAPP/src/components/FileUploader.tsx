import React, { useState } from 'react';
import axios from 'axios';
// const handleUpload = async () => {
//   try {
//     const response = await axios.get(`http://localhost:5000/api/file/generate-presigned-url?bucketName=my-bucket&fileName=${fileName}`);
//     const { url } = response.data;
    
//     const uploadResponse = await axios.put(url, file, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     console.log('File uploaded successfully:', uploadResponse);
//   } catch (error) {
//     console.error('Error uploading file:', error);
//   }
// };

const FileUploader = () => {
  
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      // שלב 1: קבלת Presigned URL מהשרת
      const response = await axios.get('/api/upload/presigned-url', {
        params: { fileName: file.name }
      });

      const presignedUrl = response.data.url;

      // שלב 2: העלאת הקובץ ישירות ל-S3
      await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percent);
        },
      });

      alert('הקובץ הועלה בהצלחה!');
    } catch (error) {
      console.error('שגיאה בהעלאה:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>העלה קובץ</button>
      {progress > 0 && <div>התקדמות: {progress}%</div>}
    </div>
  );
};

export default FileUploader;
