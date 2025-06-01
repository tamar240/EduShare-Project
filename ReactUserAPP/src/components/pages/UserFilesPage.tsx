import { useState, useEffect } from "react";
import { Box,  Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Alert } from "@mui/material";
import LessonsList from "../foldersAndFilesPage/LessonsList";
import SubjectsList from "../SubjectList";
import axios from "axios"; 
import {  Subject, UserFilesPageProps } from "../typies/types";
import { getCookie } from "../login/Login";

const UserFilesPage: React.FC<UserFilesPageProps> = ({ type }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]); 
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null); 
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [page, setPage] = useState<"subjects" | "lessons">("subjects"); 
  const [loading, setLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string | null>(null); 
  const baseUrl = import.meta.env.VITE_API_URL;


  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true); 
      setError(null); 
      try {
        const token = getCookie("auth_token");
        const response = await axios.get(`${baseUrl}/api/Subject/${type === "PUBLIC" ? "public" : "my"}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubjects(response.data);
      } catch (error) {
        setError("Failed to fetch subjects"); 
      } finally {
        setLoading(false); 
      }
    };

    fetchSubjects();
  }, [type]);

  const handleShowLessons = (subjectId: number) => {
    setPage("lessons");
    setSelectedSubject(subjects.find((subject) => subject.id === subjectId) || null);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <CircularProgress /> 
          </Box>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error} 
          </Alert>
        )}

        {page === "subjects" && !loading && !error && (
          <SubjectsList
            subjects={subjects} 
            onShowLessons={handleShowLessons} 
            type={type}
          />
        )}
        
        {page === "lessons" && selectedSubject && !loading && !error && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2, cursor: "pointer" }} onClick={() => setPage("subjects")}>
              ⬅️ חזרה למקצועות
            </Typography>
            <LessonsList subjectId={selectedSubject.id} type={type} selectedSubjectLessons={null} />
          </Box>
        )}
      </Box>


      <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)}>
        <DialogTitle>פרטי מקצוע</DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)}>סגור</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserFilesPage;
