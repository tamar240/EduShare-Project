
import { useEffect, useState, useRef } from 'react';
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
  IconButton,
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

  const observer = useRef<IntersectionObserver | null>(null);
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = getCookie('auth_token');
        const response = await axios.get(`${baseUrl}/api/UploadedFile/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFiles(response.data);
      } catch (error) {
        console.error('שגיאה בקבלת הקבצים:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [userId]);

  const loadViewUrl = async (filePath: string) => {
    if (viewUrls[filePath]) return;
    try {
      const token = getCookie('auth_token');
      const res = await axios.get(`${baseUrl}/api/upload/presigned-url/view`, {
        params: { filePath },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setViewUrls(prev => ({ ...prev, [filePath]: res.data.url }));
    } catch (err) {
      console.error(`שגיאה בטעינת URL עבור ${filePath}:`, err);
    }
  };

  const previewRef = (file: UploadedFile) => {
    const ref = (node: HTMLDivElement | null) => {
      if (node && !viewUrls[file.filePath]) {
        if (!observer.current) {
          observer.current = new IntersectionObserver(entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const filePath = entry.target.getAttribute('data-filepath');
                if (filePath) loadViewUrl(filePath);
              }
            });
          });
        }
        node.setAttribute('data-filepath', file.filePath);
        observer.current.observe(node);
      }
    };
    return ref;
  };

  const renderPreview = (file: UploadedFile) => {
    const url = viewUrls[file.filePath];
    const type = file.fileType;

    if (!url) {
      return (
        <Box textAlign="center" py={2}>
          <CircularProgress size={24} />
        </Box>
      );
    }

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
      type.includes('word') ||
      type.includes('presentation') ||
      type.includes('powerpoint')
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

  const handleDeleteFile = async () => {
    if (selectedFileId === null) return;
    try {
      const token = getCookie('auth_token');
      await axios.delete(`${baseUrl}/api/UploadedFile/${selectedFileId}`, {
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

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography mt={2}>טוען קבצים...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f4f6f8',
        minHeight: '100vh',
      }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: '700',
          textAlign: 'right',
          color: '#333',
        }}
      >
         הקבצים שלך
      </Typography>

      <Grid container spacing={3}>
        {files.map(file => (
          <Grid item xs={12} sm={6} md={4} key={file.id}>
            {/* <Card
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              ref={previewRef(file)}
            >
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
            </Card> */}
           <Card
  sx={{
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #d0d7de',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    transition: 'all 0.25s ease-in-out',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      transform: 'translateY(-2px)',
    },
    position: 'relative',
    paddingBottom: '36px',
  }}
  ref={previewRef(file)}
>
  {renderPreview(file)}

  <CardContent sx={{ flexGrow: 1 }}>
    <Typography
      variant="subtitle2"
      fontWeight={600}
      gutterBottom
      noWrap
    >
      {file.fileName}
    </Typography>

    <Typography variant="caption" color="text.secondary">
      סוג: {file.fileType} | גודל: {(file.size / 1024).toFixed(1)} KB
    </Typography>
  </CardContent>

  {/* כפתור מחיקה – צד שמאל למטה */}
  <Box
    sx={{
      position: 'absolute',
      bottom: 8,
      left: 8,
    }}
  >
    <IconButton
      size="small"
      color="error"
      onClick={() => {
        setSelectedFileId(file.id);
        setDialogOpen(true);
      }}
    >
      <DeleteIcon fontSize="small" />
    </IconButton>
  </Box>
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
