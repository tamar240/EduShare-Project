// import  { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Box, Typography, Card, CardMedia, CardContent, Button, Grid, CircularProgress } from '@mui/material';
// import { getCookie } from './login/Login';


// interface UploadedFile {
//   id: number;
//   fileName: string;
//   fileType: string;
//   filePath: string;
//   size: number;
//   lessonId: number;
// }

// const UserFileGallery = ({ userId }: { userId: number }) => {
//   const [files, setFiles] = useState<UploadedFile[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [viewUrls, setViewUrls] = useState<Record<string, string>>({});

//   useEffect(() => {
//     const fetchFiles = async () => {
//       try {
//         const token = getCookie('auth_token');
//         console.log("userId", userId);
        
//         const response = await axios.get(`https://localhost:7249/api/UploadedFile/user/${userId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const files = response.data as UploadedFile[];
//         setFiles(files);

//         const urls: Record<string, string> = {};
//         for (const file of files) {
//           const viewRes = await axios.get('https://localhost:7249/api/upload/presigned-url/view', {
//             params: { filePath: file.filePath },
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           urls[file.filePath] = viewRes.data.url;
//         }
//         setViewUrls(urls);
//       } catch (error) {
//         console.error('שגיאה בקבלת הקבצים:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFiles();
//   }, [userId]);

//   const renderPreview = (file: UploadedFile) => {
//     const url = viewUrls[file.filePath];
//     const type = file.fileType;

//     if (!url) return <Typography>לא ניתן לטעון</Typography>;

//     if (type.startsWith('image/')) {
//       return <CardMedia component="img" height="140" image={url} alt={file.fileName} />;
//     }

//     if (type === 'application/pdf') {
//       return (
//         <iframe
//           src={url}
//           style={{ width: '100%', height: 200, border: 'none' }}
//           title={file.fileName}
//         />
//       );
//     }

//     if (type.startsWith('video/')) {
//       return (
//         <video controls style={{ width: '100%', height: 200 }}>
//           <source src={url} type={type} />
//         </video>
//       );
//     }

//     if (
//       type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
//       type === 'application/msword' ||
//       type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
//       type === 'application/vnd.ms-powerpoint'
//     ) {
//       return (
//         <Button variant="outlined" href={url} target="_blank">
//           פתח קובץ {type.includes('word') ? 'Word' : 'PowerPoint'}
//         </Button>
//       );
//     }

//     return (
//       <Button variant="outlined" href={url} target="_blank">
//         הורד קובץ
//       </Button>
//     );
//   };

//   if (loading) {
//     return (
//       <Box textAlign="center" mt={4}>
//         <CircularProgress />
//         <Typography mt={2}>טוען קבצים...</Typography>
//       </Box>
//     );
//   }

//   return (


// <Box sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
//       <Typography variant="h5" gutterBottom>
//         📁 הקבצים שלך
//       </Typography>
//       <Grid container spacing={3}>
//         {files.map((file) => (
//           <Grid item xs={12} sm={6} md={4} key={file.id}>
//             <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//               {renderPreview(file)}
//               <CardContent>
//                 <Typography variant="body1">📄 {file.fileName}</Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   סוג: {file.fileType} | גודל: {(file.size / 1024).toFixed(1)} KB
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// export default UserFileGallery;
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Grid,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getCookie } from './login/Login';
import PopupDialog from './parts/PopupDialog';

interface UploadedFile {
  id: number;
  fileName: string;
  fileType: string;
  filePath: string;
  size: number;
  lessonId: number;
}

const UserFileGallery = ({ userId }: { userId: number }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewUrls, setViewUrls] = useState<Record<string, string>>({});
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = getCookie('auth_token');
        console.log('userId', userId);

        const response = await axios.get(`https://localhost:7249/api/UploadedFile/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const files = response.data as UploadedFile[];
        setFiles(files);

        const urls: Record<string, string> = {};
        for (const file of files) {
          const viewRes = await axios.get('https://localhost:7249/api/upload/presigned-url/view', {
            params: { filePath: file.filePath },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          urls[file.filePath] = viewRes.data.url;
        }
        setViewUrls(urls);
      } catch (error) {
        console.error('שגיאה בקבלת הקבצים:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [userId]);

  const handleDeleteFile = async () => {
    if (selectedFileId === null) return;
    try {
      const token = getCookie('auth_token');
      await axios.delete(`https://localhost:7249/api/UploadedFile/${selectedFileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(prev => prev.filter(f => f.id !== selectedFileId));
    } catch (error) {
      console.error('שגיאה במחיקת הקובץ:', error);
    } finally {
      setDialogOpen(false);
      setSelectedFileId(null);
    }
  };

  const renderPreview = (file: UploadedFile) => {
    const url = viewUrls[file.filePath];
    const type = file.fileType;

    if (!url) return <Typography>לא ניתן לטעון</Typography>;

    if (type.startsWith('image/')) {
      return <CardMedia component="img" height="140" image={url} alt={file.fileName} />;
    }

    if (type === 'application/pdf') {
      return (
        <iframe
          src={url}
          style={{ width: '100%', height: 200, border: 'none' }}
          title={file.fileName}
        />
      );
    }

    if (type.startsWith('video/')) {
      return (
        <video controls style={{ width: '100%', height: 200 }}>
          <source src={url} type={type} />
        </video>
      );
    }

    if (
      type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      type === 'application/msword' ||
      type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      type === 'application/vnd.ms-powerpoint'
    ) {
      return (
        <Button variant="outlined" href={url} target="_blank">
          פתח קובץ {type.includes('word') ? 'Word' : 'PowerPoint'}
        </Button>
      );
    }

    return (
      <Button variant="outlined" href={url} target="_blank">
        הורד קובץ
      </Button>
    );
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography mt={2}>טוען קבצים...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" gutterBottom>
        📁 הקבצים שלך
      </Typography>
      <Grid container spacing={3}>
        {files.map((file) => (
          <Grid item xs={12} sm={6} md={4} key={file.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {renderPreview(file)}
              <CardContent>
                <Typography variant="body1">📄 {file.fileName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  סוג: {file.fileType} | גודל: {(file.size / 1024).toFixed(1)} KB
                </Typography>
                <Button
                  startIcon={<DeleteIcon />}
                  color="error"
                  onClick={() => {
                    setSelectedFileId(file.id);
                    setDialogOpen(true);
                  }}
                  sx={{ mt: 1 }}
                >
                  מחק קובץ
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <PopupDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleDeleteFile}
        message="האם אתה בטוח שברצונך למחוק את הקובץ? פעולה זו אינה הפיכה."
      />
    </Box>
  );
};

export default UserFileGallery;
