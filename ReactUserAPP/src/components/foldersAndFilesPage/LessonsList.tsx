
import { useState, useEffect } from "react";
import { Grid, Button, Dialog, DialogActions, DialogContent, TextField, FormControl, InputLabel, Select, MenuItem, DialogTitle } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { getCookie } from "../login/Login";
import { Lesson } from "../typies/types";
import LessonItem from "./LessonItem";


interface LessonListProps {
  subjectId: number;
  type: "PUBLIC" | "PERSONAL";
}

const LessonsGrid = ({ subjectId, type }: LessonListProps) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [addLessonDialogOpen, setAddLessonDialogOpen] = useState<boolean>(false);
  const [newLessonName, setNewLessonName] = useState<string>("");
  const [newLessonPermission, setNewLessonPermission] = useState<number>(0);

  const fetchLessons = async () => {
    try {
      const token = getCookie("auth_token");
      console.log("url " + `https://localhost:7249/api/Lesson/${type === "PUBLIC" ? "public" : "my"}/${subjectId}`);
      
      const response = await axios.get<Lesson[]>(
        `https://localhost:7249/api/Lesson/${type === "PUBLIC" ? "public" : "my"}/${subjectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // debugger
      setLessons(response.data); // עדכון השיעורים
    } catch (error) {
      console.error("Failed to fetch lessons", error);
    }
  };

  // קריאה ל-API בכל פעם ש- subjectId או type משתנים
  useEffect(() => {
    console.log("subjectId", subjectId); // בדוק אם הערך כאן נכון
    console.log("type", type); // בדוק אם הערך כאן נכון
    if (subjectId) {
      fetchLessons(); // קריאה ל-API רק אם יש subjectId
    }
  }, [subjectId, type]); // קריאה רק אם אחד מהם משתנה
  

  const handleAddLesson = async () => {
    try {
      const token = getCookie("auth_token");

      const response = await axios.post(
        "https://localhost:7249/api/Lesson",
        {
          name: newLessonName,
          subjectId: subjectId,
          permission: newLessonPermission,
        },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      // עדכון רשימת השיעורים עם השיעור החדש
      setLessons((prevLessons) => [...prevLessons, response.data]);

      // סגירת הדיאלוג ואיפוס שדות
      setAddLessonDialogOpen(false);
      setNewLessonName("");
      setNewLessonPermission(0);
    } catch (error) {
      console.error("Failed to add lesson", error);
    }
  };

  const handleUpdateLesson = (updatedLesson: Lesson) => {
    setLessons(lessons.map((lesson) => (lesson.id === updatedLesson.id ? updatedLesson : lesson)));
  };

  const handleDeleteLesson = async (lessonId: number) => {
    try {
      const token = getCookie("auth_token");
      await axios.delete(`https://localhost:7249/api/Lesson/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons(lessons.filter((lesson) => lesson.id !== lessonId));
    } catch (error) {
      console.error("Failed to delete lesson", error);
    }
  };

  const handlePermissionChange = async (lessonId: number, newPermission: number) => {
    try {
      const token = getCookie("auth_token");
      await axios.put(
        `https://localhost:7249/api/Lesson/permission/${lessonId}`,
        { permission: newPermission },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      setLessons(lessons.map((lesson) => (lesson.id === lessonId ? { ...lesson, permission: newPermission } : lesson)));
    } catch (error) {
      console.error("Failed to update permission", error);
    }
  };

  if (!lessons) return null;

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
        {type === "PERSONAL" && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddLessonDialogOpen(true)}>
            הוסף שיעור
          </Button>
        )}
      </Grid>

      {lessons.map((lesson) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={lesson.id}>
          <LessonItem
            lesson={lesson}
            onDelete={handleDeleteLesson}
            onUpdate={handleUpdateLesson}
            onPermissionChange={handlePermissionChange}
            type={type}
          />
        </Grid>
      ))}

      <Dialog open={addLessonDialogOpen} onClose={() => setAddLessonDialogOpen(false)}>
        {type === "PERSONAL" && <DialogTitle>הוסף שיעור חדש</DialogTitle>}
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="שם השיעור"
            value={newLessonName}
            onChange={(e) => setNewLessonName(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>הרשאה</InputLabel>
            <Select value={newLessonPermission} onChange={(e) => setNewLessonPermission(Number(e.target.value))}>
              <MenuItem value={0}>פרטי</MenuItem>
              <MenuItem value={1}>ציבורי</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddLessonDialogOpen(false)} color="primary">ביטול</Button>
          <Button onClick={handleAddLesson} color="secondary">הוסף</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default LessonsGrid;

