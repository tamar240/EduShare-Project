import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { DeleteForever, RestoreFromTrash } from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import PopupDialog from './parts/PopupDialog';
import { getCookie } from './login/Login';
import { UploadedFile } from './UserFileGallery';

const baseUrl = import.meta.env.VITE_API_URL;




type ActionType = 'restore' | 'delete';

const RecycleBin: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [actionType, setActionType] = useState<ActionType | null>(null);

  const token = getCookie("auth_token");

  const fetchDeletedFiles = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/UploadedFile/deleted`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFiles(res.data);
    } catch (err) {
      console.error('⚠️ Failed to fetch deleted files:', err);
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (file: UploadedFile, type: ActionType) => {
    setSelectedFile(file);
    setActionType(type);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedFile(null);
    setActionType(null);
  };

  const confirmAction = async () => {
    if (!selectedFile || !actionType || !token) return;

    try {
      if (actionType === 'restore') {

        console.log("restore: selectedFile", selectedFile);
        console.log("restore: token", token);
        await axios.put(
          `${baseUrl}/api/UploadedFile/restore/${selectedFile.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log("hard: selectedFile", selectedFile);
        console.log("hard: token", token);
        
        
      } else if (actionType === 'delete') {
        await axios.delete(`${baseUrl}/api/UploadedFile/hard-delete/${selectedFile.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      setFiles(prev => prev.filter(file => file.id !== selectedFile.id));
    } catch (err) {
      console.error('⚠️ פעולה נכשלה:', err);
    } finally {
      closeDialog();
    }
  };

  useEffect(() => {
    fetchDeletedFiles();
  }, []);

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 5 }} />;

  return (
    <>
      <Grid container spacing={2} sx={{ p: 4 }}>
        {files.length === 0 ? (
          <Typography variant="h6" sx={{ m: 'auto' }}>
            לא נמצאו קבצים שנמחקו.
          </Typography>
        ) : (
          files.map(file => (
            <Grid item xs={12} sm={6} md={4} key={file.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    backgroundColor: '#f5f5f5',
                    transition: '0.3s',
                    '&:hover': {
                      boxShadow: 6
                    }
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {file.fileName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {file.fileType || 'ללא סוג'}
                    </Typography>

                    <Grid container spacing={1} justifyContent="flex-end">
                      <Grid item>
                        <Tooltip title="שחזר קובץ">
                          <IconButton
                            color="primary"
                            onClick={() => openDialog(file, 'restore')}
                          >
                            <RestoreFromTrash />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                      <Grid item>
                        <Tooltip title="מחק לצמיתות">
                          <IconButton
                            color="error"
                            onClick={() => openDialog(file, 'delete')}
                          >
                            <DeleteForever />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))
        )}
      </Grid>

      <PopupDialog
        open={dialogOpen}
        onClose={closeDialog}
        onConfirm={confirmAction}
        message={
          actionType === 'restore'
            ? `האם אתה בטוח שברצונך לשחזר את הקובץ "${selectedFile?.fileName}"?`
            : `האם אתה בטוח שברצונך למחוק לצמיתות את הקובץ "${selectedFile?.fileName}"?`
        }
      />
    </>
  );
};

export default RecycleBin;
