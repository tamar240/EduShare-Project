import { useState } from "react";
import { Grid, Paper, Box, Typography, IconButton, TextField, Menu, MenuItem, Tooltip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Lesson } from "./UserFilesPage";
import axios from "axios";
import { getCookie } from "./Login";

interface LessonListProps {
  selectedSubjectLessons: Lesson[] | null;
}

const LessonList = ({ selectedSubjectLessons }: LessonListProps) => {
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [lessonName, setLessonName] = useState<string>("");
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);

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
        lesson.name = lessonName;
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, lesson: Lesson) => {
    setMenuAnchor(event.currentTarget);
    setSelectedLesson(lesson);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setTooltipOpen(false);
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

            {/* תפריט */}
            <Menu
  anchorEl={menuAnchor}
  open={Boolean(menuAnchor)}
  onClose={handleMenuClose}
  PaperProps={{ elevation: 1 }} // מסיר את הצל
>
  <MenuItem>⬇️ הורדה</MenuItem>

  <Tooltip
    title={
      <Box sx={{ textAlign: "right", p: 1 }}>
        <Typography variant="subtitle2" fontWeight="bold">פרטי שיעור</Typography>
        <Typography variant="body2">שם: {selectedLesson?.name ?? "לא ידוע"}</Typography>
        <Typography variant="body2">תאריך יצירה: {selectedLesson?.createdAt ?? "לא ידוע"}</Typography>
        <Typography variant="body2">מורה: {selectedLesson?.ownerId ?? "לא ידוע"}</Typography>
        <Typography variant="body2">v: {selectedLesson?.ownerId ?? "לא ידוע"}</Typography>
      </Box>
    }
    placement="left"
    arrow
    open={tooltipOpen}
    onOpen={() => setTooltipOpen(true)}
    onClose={() => setTooltipOpen(false)}
  >
    <MenuItem
      onMouseEnter={() => setTooltipOpen(true)}
      onMouseLeave={() => setTooltipOpen(false)}
    >
      ⬅️ פרטים
    </MenuItem>
  </Tooltip>
</Menu>


          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default LessonList;
