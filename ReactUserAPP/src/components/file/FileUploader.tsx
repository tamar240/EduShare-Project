
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { getCookie } from '../login/Login';
import AWSFileUpload from './AWSFileUpload';

const FileUploader: React.FC = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedLesson, setSelectedLesson] = useState<string>('');
  const [viewUrl, setViewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      const token = getCookie("auth_token");
      try {
        const response = await axios.get('https://localhost:7249/api/Subject/my', {
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
          const response = await axios.get(`https://localhost:7249/api/Lesson/my/${selectedSubject}`, {
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
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', textAlign: 'center', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>📤 העלאת קובץ</Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>בחר מקצוע</InputLabel>
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

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>בחר שיעור</InputLabel>
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

      {selectedLesson && (
       <AWSFileUpload
       lessonId={selectedLesson}
       onUploadComplete={(uploadedFile) => {
         console.log("📦 כל המידע של הקובץ:", uploadedFile);
         setViewUrl(uploadedFile.viewUrl); // לשמירה לצפייה אם צריך
         // אפשר גם לשמור את uploadedFile כולו בסטייט אם תרצה
       }}
     />
     
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
