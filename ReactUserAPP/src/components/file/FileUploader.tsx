
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Fade,
  Divider,
  Container,
} from '@mui/material';
import { getCookie } from '../login/Login';
import AWSFileUpload from './AWSFileUpload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ClassIcon from '@mui/icons-material/Class';

const FileUploader: React.FC = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedLesson, setSelectedLesson] = useState<string>('');
  const [viewUrl, setViewUrl] = useState<string | null>(null);

  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchSubjects = async () => {
      const token = getCookie("auth_token");
      try {
        const response = await axios.get(`${baseUrl}/api/Subject/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubjects(response.data);
      } catch (error) {
        console.error("❌ שגיאה בטעינת המקצועות:", error);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    const fetchLessons = async () => {
      if (selectedSubject) {
        const token = getCookie("auth_token");
        try {
          const response = await axios.get(`${baseUrl}/api/Lesson/my/${selectedSubject}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setLessons(response.data);
        } catch (error) {
          console.error("❌ שגיאה בטעינת השיעורים:", error);
        }
      }
    };
    fetchLessons();
  }, [selectedSubject]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 4,
            background: 'linear-gradient(145deg, #f4f6f9, #ffffff)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
            <CloudUploadIcon sx={{ fontSize: 36, color: '#1976d2', mr: 1 }} />
            <Typography variant="h4" fontWeight={600}>
              העלאת קובץ לשיעור
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel><MenuBookIcon sx={{ mr: 1, verticalAlign: 'middle' }} />בחר מקצוע</InputLabel>
            <Select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              label="בחר מקצוע"
            >
              {subjects.map((subject) => (
                <MenuItem key={subject.id} value={subject.id}>
                  {subject.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel><ClassIcon sx={{ mr: 1, verticalAlign: 'middle' }} />בחר שיעור</InputLabel>
            <Select
              value={selectedLesson}
              onChange={(e) => setSelectedLesson(e.target.value)}
              label="בחר שיעור"
              disabled={!selectedSubject}
            >
              {lessons.map((lesson) => (
                <MenuItem key={lesson.id} value={lesson.id}>
                  {lesson.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Fade in={Boolean(selectedLesson)}>
            <Box sx={{ mb: 4 }}>
              <AWSFileUpload
                lessonId={selectedLesson}
                onUploadComplete={(uploadedFile) => {
                  console.log("📦 כל המידע של הקובץ:", uploadedFile);
                  setViewUrl(uploadedFile.viewUrl);
                }}
              />
            </Box>
          </Fade>

          {viewUrl && (
            <Typography variant="body1" sx={{ mt: 5, textAlign: 'center' }}>
              📂 <a href={viewUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#1565c0', textDecoration: 'none' }}>
                פתח קובץ שהועלה
              </a>
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default FileUploader;
