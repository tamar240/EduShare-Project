import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name); // שמור את שם הקובץ
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    try {
      // 1. קבלת ה-Presigned URL מהשרת שלך
      const response = await axios.get(`http://localhost:5000/api/file/generate-presigned-url?bucketName=my-bucket&fileName=${fileName}`);
      const { url } = response.data;

      // 2. העלאת הקובץ ל-S3 באמצעות ה-Presigned URL
      const uploadResponse = await axios.put(url, file, {
        headers: {
          'Content-Type': 'multipart/form-data', // יכול להיות תלוי בסוג הקובץ
        },
      });

      console.log('File uploaded successfully:', uploadResponse);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'העלה קובץ'}
      </button>
    </div>
  );
};

export default FileUpload;
