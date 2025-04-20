// import React, { useState } from 'react';
// import axios from 'axios';
// import { Button, LinearProgress, Typography, Box, Paper } from '@mui/material';
// import { getCookie } from '../login/Login';

// const FileUploader = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [progress, setProgress] = useState<number>(0);
//   const [uploadUrl, setUploadUrl] = useState<string | null>(null);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setFile(e.target.files[0]);
//       setProgress(0);  // איפוס ההתקדמות
//       setUploadUrl(null);  // איפוס ה-URL
//     }
//   };

//   const getSignedViewUrl = async (filePath: string) => {
//     const token = getCookie("auth_token");
//     const response = await axios.get('https://localhost:7249/api/upload/presigned-url/view', {
//       params: { filePath },
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
  
//     setUploadUrl( response.data.url); // הצג אותו בתוך iframe או כקישור
//   };
  
//   const handleUpload = async () => {
//     if (!file) return;
//     var type = file.type;
//     var token = getCookie("auth_token");
//     debugger
//     try {
//       const response = await axios.get('https://localhost:7249/api/upload/presigned-url', {
//         params: {
//           fileName: file.name,
//           contentType: type,
//         },
//         headers: {
//           "Authorization": `Bearer ${token}`,
//         },
//       });

//       const presignedUrl = response.data.url;
//       // setUploadUrl(presignedUrl);
//       const fileKey = presignedUrl.split('.com/')[1].split('?')[0];
// getSignedViewUrl(fileKey);

 
//       await axios.put(presignedUrl, file, {
//         headers: {
//           'Content-Type': file.type,
//         },
//         onUploadProgress: (progressEvent) => {
//           const percent = Math.round(
//             (progressEvent.loaded * 100) / (progressEvent.total || 1)
//           );
//           setProgress(percent);
//         },
//       });
      
      
//       const fileData = {
//         fileName: file.name,
//         fileType: file.type,
//         filePath: presignedUrl.split('?')[0],
//         size: file.size,
//         lessonId: 2070, // אחרי שנקרא להעלת קובץ דרך שיעור מסוים נוכל לעדכן פה
     
//       };
//       console.log("path", fileData.filePath);
      
// debugger
//       await axios.post('https://localhost:7249/api/UploadedFile', fileData, {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       alert('✅ הקובץ הועלה בהצלחה!');
//     } catch (error) {
//       console.error('❌ שגיאה בהעלאה:', error);
//     }
//   };

//   return (
//     <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', textAlign: 'center', borderRadius: 2 }}>
//       <Typography variant="h5" gutterBottom>📤 העלאת קובץ</Typography>
//       <input
//         type="file"
//         onChange={handleFileChange}
//         style={{ display: 'none' }}
//         id="file-input"
//       />
//       <label htmlFor="file-input">
//         <Button
//           variant="contained"
//           component="span"

//           sx={{ mb: 2 }}
//         >
//           בחר קובץ
//         </Button>
//       </label>
//       {file && <Typography variant="body1" gutterBottom>📄 {file.name}</Typography>}
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
//         <Box sx={{ width: '100%', mt: 2 }}>
//           <LinearProgress variant="determinate" value={progress} />
//           <Typography variant="body2" sx={{ mt: 1 }}>🔄 התקדמות: {progress}%</Typography>
//         </Box>
//       )}
//       {uploadUrl && (
//         <Typography variant="body2" sx={{ mt: 2 }}>
//           📂 <a href={uploadUrl} target="_blank" rel="noopener noreferrer">פתח קובץ</a>
//         </Typography>
//       )}
//     </Paper>
//   );
// };

// export default FileUploader;
import React, { useState } from 'react';
import axios from 'axios';
import { Button, LinearProgress, Typography, Box, Paper } from '@mui/material';
import { getCookie } from '../login/Login';

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [viewUrl, setViewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      console.log("📁 שם קובץ:", selectedFile.name);
      console.log("🧾 סוג קובץ:", selectedFile.type); // <-- זה השורה שחשובה כרגע
  
      setFile(selectedFile);
      setProgress(0);
      setViewUrl(null);
    }
  };
  

  const getSignedViewUrl = async (fileKey: string) => {
    const token = getCookie("auth_token");

    const response = await axios.get('https://localhost:7249/api/upload/presigned-url/view', {
      params: { filePath: fileKey },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setViewUrl(response.data.url);
    console.log("viewUrl2", viewUrl);
    console.log("response", response);
      
  };

  const handleUpload = async () => {
    if (!file) return;

    const token = getCookie("auth_token");

    try {
      // 1. בקשת כתובת חתומה להעלאה
      const response = await axios.get('https://localhost:7249/api/upload/presigned-url', {
        params: {
          fileName: file.name,
          contentType: file.type,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
debugger
      const uploadUrl = response.data.url;
      const fileKey = uploadUrl.split('.com/')[1].split('?')[0]; // הפקת ה-Key מתוך ה-URL

      // 2. העלאת הקובץ ל-S3
      await axios.put(uploadUrl, file, {
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

      // 3. שמירת נתוני הקובץ ב-DB
      const fileData = {
        fileName: file.name,
        fileType: file.type,
        filePath: fileKey, // שמירת הנתיב היחסי בלבד!
        size: file.size,
        lessonId: 2070,
      };

      await axios.post('https://localhost:7249/api/UploadedFile', fileData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });


      // 4. קבלת URL חתום לצפייה
      await getSignedViewUrl(fileKey);
      console.log("viewUrl", viewUrl);
      

      alert('✅ הקובץ הועלה בהצלחה!');
    } catch (error) {
      console.error('❌ שגיאה בהעלאה:', error);
      alert('אירעה שגיאה בהעלאה. ראה קונסול.');
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
        <Button variant="contained" component="span" sx={{ mb: 2 }}>
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

      {viewUrl && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          📂 <a href={viewUrl} target="_blank" rel="noopener noreferrer">פתח קובץ</a>
        </Typography>
      )}
    </Paper>
  );
};

export default FileUploader;
