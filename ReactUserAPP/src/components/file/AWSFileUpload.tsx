
// import React, { useState } from 'react';
// import axios from 'axios';
// import { Button, Typography, Box, LinearProgress } from '@mui/material';
// import { getCookie, getUserDetailes } from '../login/Login';
// import { UploadedFileData } from '../typies/types';

// interface AWSFileUploadProps {
//   lessonId: string;
//   onUploadComplete: (file: UploadedFileData & { viewUrl: string }) => void;
// }

// const AWSFileUpload: React.FC<AWSFileUploadProps> = ({ lessonId, onUploadComplete }) => {
//   const [file, setFile] = useState<File | null>(null);
//   const [progress, setProgress] = useState<number>(0);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       setFile(e.target.files[0]);
//       setProgress(0);
//     }
//   }; 

//   const getSignedViewUrl = async (fileKey: string): Promise<string> => {
//     const token = getCookie("auth_token");
//     const response = await axios.get('https://localhost:7249/api/upload/presigned-url/view', {
//       params: { filePath: fileKey },
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data.url;
//   };

//   const handleUpload = async () => {
//     if (!file || !lessonId) return;

//     const token = getCookie("auth_token");
//     try {
//       const presignedRes = await axios.get('https://localhost:7249/api/upload/presigned-url', {
//         params: {
//           fileName: file.name,
//           contentType: file.type,
//         },
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const uploadUrl = presignedRes.data.url;
//       const fileKey = uploadUrl.split('.com/')[1].split('?')[0];

//       await axios.put(uploadUrl, file, {
//         headers: { 'Content-Type': file.type },
//         onUploadProgress: (event) => {
//           const percent = Math.round((event.loaded * 100) / (event.total || 1));
//           setProgress(percent);
//         },
//       });
//      console.log('File uploaded successfully:', fileKey);

//       const viewUrl2 = await getSignedViewUrl(fileKey);
//       const uploadedFile: UploadedFileData = {
//         id: "",
//         fileName: file.name,
//         fileType: file.type,
//         filePath: viewUrl2,
//         size: file.size,
//         lessonId,
//         s3Key: ''
//       };
//       debugger
//       // await axios.post('https://localhost:7249/api/UploadedFile', uploadedFile, {
//       //   headers: {
//       //     Authorization: `Bearer ${token}`,
//       //     "Content-Type": "application/json",
//       //   },
//       // });
//       const saveRes = await axios.post('https://localhost:7249/api/UploadedFile', uploadedFile, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
      
//       const savedFile: UploadedFileData = saveRes.data;
      
//       const viewUrl = await getSignedViewUrl(fileKey);
//       onUploadComplete({ ...savedFile, viewUrl });
      
//       alert('✅ הקובץ הועלה בהצלחה!');
//     } catch (error) {
//       console.error('❌ שגיאה בהעלאה:', error);
//       alert('אירעה שגיאה בהעלאה. ראה קונסול.');
//     }
//   };

//   return (
//     <>
//       <input type="file" onChange={handleFileChange} style={{ display: 'none' }} id="file-input" />
//       <label htmlFor="file-input">
//         <Button variant="contained" component="span" sx={{ mb: 2 }}>
//           בחר קובץ
//         </Button>
//       </label>

//       {file && <Typography variant="body1">{file.name}</Typography>}

//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleUpload}
//         disabled={!file}
//         sx={{ mb: 2 }}
//       >
//         העלה קובץ
//       </Button>

//       {progress > 0 && (
//         <Box sx={{ width: '100%' }}>
//           <LinearProgress variant="determinate" value={progress} />
//           <Typography variant="body2" sx={{ mt: 1 }}>התקדמות: {progress}%</Typography>
//         </Box>
//       )}
//     </>
//   );
// };

// export default AWSFileUpload;
import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  Typography,
  Box,
  LinearProgress,
  Stack,
  Paper,
} from '@mui/material';
import { getCookie } from '../login/Login';
import { UploadedFileData } from '../typies/types';

interface AWSFileUploadProps {
  lessonId: string;
  onUploadComplete: (file: UploadedFileData & { viewUrl: string }) => void;
}

const AWSFileUpload: React.FC<AWSFileUploadProps> = ({ lessonId, onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
      setProgress(0);
    }
  };

  const getSignedViewUrl = async (fileKey: string): Promise<string> => {
    const token = getCookie('auth_token');
    const response = await axios.get('https://localhost:7249/api/upload/presigned-url/view', {
      params: { filePath: fileKey },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.url;
  };

  const handleUpload = async () => {
    if (!file || !lessonId) return;

    const token = getCookie('auth_token');
    try {
      const presignedRes = await axios.get('https://localhost:7249/api/upload/presigned-url', {
        params: {
          fileName: file.name,
          contentType: file.type,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      const uploadUrl = presignedRes.data.url;
      const fileKey = uploadUrl.split('.com/')[1].split('?')[0];

      await axios.put(uploadUrl, file, {
        headers: { 'Content-Type': file.type },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / (event.total || 1));
          setProgress(percent);
        },
      });

      const viewUrl2 = await getSignedViewUrl(fileKey);
      const uploadedFile: UploadedFileData = {
        id: '',
        fileName: file.name,
        fileType: file.type,
        filePath: viewUrl2,
        size: file.size,
        lessonId,
        s3Key: '',
      };

      const saveRes = await axios.post('https://localhost:7249/api/UploadedFile', uploadedFile, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const savedFile: UploadedFileData = saveRes.data;
      const viewUrl = await getSignedViewUrl(fileKey);
      onUploadComplete({ ...savedFile, viewUrl });

      alert('✅ הקובץ הועלה בהצלחה!');
    } catch (error) {
      console.error('❌ שגיאה בהעלאה:', error);
      alert('אירעה שגיאה בהעלאה. ראה קונסול.');
    }
  };

  return (
    <Stack spacing={3}>
      {/* אזור גרירה או בחירה */}
      <Paper
        elevation={dragActive ? 6 : 2}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          p: 4,
          border: '2px dashed #1976d2',
          backgroundColor: dragActive ? '#e3f2fd' : '#fafafa',
          textAlign: 'center',
          cursor: 'pointer',
        }}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <Typography variant="body1" color="textSecondary">
          גרור לכאן קובץ או לחץ כדי לבחור מהמחשב
        </Typography>
        {file && (
          <Typography variant="subtitle2" sx={{ mt: 1 }}>
            {file.name}
          </Typography>
        )}
      </Paper>

      {/* כפתור העלאה */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!file}
      >
        העלה קובץ
      </Button>

      {/* פס טעינה */}
      {progress > 0 && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" sx={{ mt: 1 }}>
            התקדמות: {progress}%
          </Typography>
        </Box>
      )}
    </Stack>
  );
};

export default AWSFileUpload;
