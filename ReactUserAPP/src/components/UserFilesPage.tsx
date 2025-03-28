

import { useState, useEffect } from "react";
import { Box, Menu, MenuItem, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Alert } from "@mui/material";
import LessonsList from "./foldersAndFilesPage/LessonsList"; // אחראית על הצגת השיעורים
import SubjectsList from "./SubjectList"; // אחראית על הצגת המקצועות
import axios from "axios"; // אם אתה שולף את הנתונים מ-API
import { Lesson, Subject, UserFilesPageProps } from "./typies/types";
import { getCookie } from "./login/Login";

const UserFilesPage: React.FC<UserFilesPageProps> = ({ type }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]); // הסטייט עבור רשימת המקצועות
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null); // מאחסן את המקצוע שנבחר
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [page, setPage] = useState<"subjects" | "lessons">("subjects"); // שולט האם אנחנו בדף של המקצועות או השיעורים
  const [loading, setLoading] = useState<boolean>(false); // סטייט למצב טעינה
  const [error, setError] = useState<string | null>(null); // סטייט לשגיאות

  // קריאה ל-API כדי לשלוף את רשימת המקצועות
  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true); // מתחילים טעינה
      setError(null); // לא היו שגיאות עד כה
      try {
        const token = getCookie("auth_token");
        const response = await axios.get(`https://localhost:7249/api/Subject/${type === "PUBLIC" ? "public" : "my"}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubjects(response.data);
      } catch (error) {
        setError("Failed to fetch subjects"); // שגיאה בטעינה
      } finally {
        setLoading(false); // סיימנו את טעינת הנתונים
      }
    };

    fetchSubjects();
  }, [type]);

  // פונקציה המיועדת לשנות את הדף לשיעורים
  const handleShowLessons = (subjectId: number) => {
    setPage("lessons");
    // נבחר את המקצוע בהתאם ל-ID
    setSelectedSubject(subjects.find((subject) => subject.id === subjectId) || null);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* אם אנחנו בדף של המקצועות */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <CircularProgress /> {/* מציג את האנימציה של טעינה */}
          </Box>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error} {/* מציג את הודעת השגיאה */}
          </Alert>
        )}

        {page === "subjects" && !loading && !error && (
          <SubjectsList
            subjects={subjects} // שולחים את רשימת המקצועות
            onShowLessons={handleShowLessons} // מעבירים את הפונקציה לצפייה בשיעורים
            type={type}
          />
        )}
        
        {/* אם אנחנו בדף של השיעורים */}
        {page === "lessons" && selectedSubject && !loading && !error && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2, cursor: "pointer" }} onClick={() => setPage("subjects")}>
              ⬅️ חזרה למקצועות
            </Typography>
            <LessonsList subjectId={selectedSubject.id} type={type} />
          </Box>
        )}
      </Box>

      {/* תפריט עבור אפשרויות נוספות */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
        <MenuItem onClick={() => console.log("Download", selectedLesson)}>הורדה</MenuItem>
      </Menu>

      {/* דיאלוג פרטי מקצוע */}
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
