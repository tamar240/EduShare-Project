import { useState } from "react";
import { Grid, Paper, Box, Typography, IconButton, TextField } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Lesson } from "./UserFilesPage";
import axios from "axios";
import { getCookie } from "./Login";

interface LessonListProps {
  selectedSubjectLessons: Lesson[] | null;
  handleMenuOpen: (event: React.MouseEvent<HTMLButtonElement>, lesson: Lesson) => void;
}

const LessonList = ({ selectedSubjectLessons, handleMenuOpen }: LessonListProps) => {
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [lessonName, setLessonName] = useState<string>("");

  const handleDoubleClick = (lesson: Lesson) => {
    setEditingLessonId(lesson.id);
    setLessonName(lesson.name);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLessonName(event.target.value);
  };

  const handleBlur = async (lesson: Lesson) => {
    if (lessonName.trim() !== "" && lessonName !== lesson.name) {
      try {
        const token = getCookie("auth_token");
        await axios.put(`https://localhost:7249/api/Lesson/${lesson.id}`, { ...lesson, name: lessonName }, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        lesson.name = lessonName; // עדכון המידע מקומית בלי צורך ברענון נוסף
      } catch (error) {
        console.error("Failed to update lesson", error);
      }
    }
    setEditingLessonId(null);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>, lesson: Lesson) => {
    if (event.key === "Enter") {
      handleBlur(lesson);
    }
  };

  if (!selectedSubjectLessons) return null;

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {selectedSubjectLessons.map((lesson) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={lesson.id}>
          <Paper elevation={3} sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ flexGrow: 1 }} onDoubleClick={() => handleDoubleClick(lesson)}>
              {editingLessonId === lesson.id ? (
                <TextField
                  value={lessonName}
                  onChange={handleChange}
                  onBlur={() => handleBlur(lesson)}
                  onKeyDown={(event) => handleKeyPress(event as React.KeyboardEvent<HTMLInputElement>, lesson)}
                  autoFocus
                  variant="standard"
                  fullWidth
                />
              ) : (
                <Typography variant="subtitle1">{lesson.name}</Typography>
              )}
            </Box>
            <IconButton onClick={(event) => handleMenuOpen(event, lesson)}>
              <MoreVertIcon />
            </IconButton>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default LessonList;
