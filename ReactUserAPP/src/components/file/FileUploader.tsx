import React, { useState } from 'react';
import axios from 'axios';
import { Button, LinearProgress, Typography, Box, Paper } from '@mui/material';
import { getCookie } from '../login/Login';

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setProgress(0);  // איפוס ההתקדמות
      setUploadUrl(null);  // איפוס ה-URL
    }
  };


  const handleUpload = async () => {
    if (!file) return;
    var type = file.type;
    var token = getCookie("auth_token");
    debugger
    try {
      const response = await axios.get('https://localhost:7249/api/upload/presigned-url', {
        params: {
          fileName: file.name,
          contentType: type,
        },
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const presignedUrl = response.data.url;
      setUploadUrl(presignedUrl);

 
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
      
      const fileData = {
        fileName: file.name,
        fileType: file.type,
        filePath: presignedUrl.split('?')[0],
        size: file.size,
        lessonId: 2070, // אחרי שנקרא להעלת קובץ דרך שיעור מסוים נוכל לעדכן פה
      };
debugger
      await axios.post('https://localhost:7249/api/UploadedFile', fileData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert('✅ הקובץ הועלה בהצלחה!');
    } catch (error) {
      console.error('❌ שגיאה בהעלאה:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', textAlign: 'center', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>📤 העלאת קובץ</Typography>
      <input
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="file-input"
      />
      <label htmlFor="file-input">
        <Button
          variant="contained"
          component="span"

          sx={{ mb: 2 }}
        >
          בחר קובץ
        </Button>
      </label>
      {file && <Typography variant="body1" gutterBottom>📄 {file.name}</Typography>}
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!file}
        sx={{ mb: 2 }}
      >
        העלה קובץ
      </Button>
      {progress > 0 && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" sx={{ mt: 1 }}>🔄 התקדמות: {progress}%</Typography>
        </Box>
      )}
      {uploadUrl && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          📂 <a href={uploadUrl} target="_blank" rel="noopener noreferrer">פתח קובץ</a>
        </Typography>
      )}
    </Paper>
  );
};

export default FileUploader;
