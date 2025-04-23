


import { useState, useEffect } from "react";
import { Grid, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { getCookie } from "../login/Login";
import { Lesson } from "../typies/types";
import LessonItem from "./LessonItem";
import AddLesson from "./AddLesson";


interface LessonListProps {
  subjectId: number;
  type: "PUBLIC" | "PERSONAL";
}

const LessonsGrid = ({ subjectId, type }: LessonListProps) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [addLessonDialogOpen, setAddLessonDialogOpen] = useState<boolean>(false);

  const fetchLessons = async () => {
    try {
      const token = getCookie("auth_token");
      const response = await axios.get<Lesson[]>(
        `https://localhost:7249/api/Lesson/${type === "PUBLIC" ? "public" : "my"}/${subjectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLessons(response.data);
    } catch (error) {
      console.error("Failed to fetch lessons", error);
    }
  };

  useEffect(() => {
    if (subjectId) {
      fetchLessons();
    }
  }, [subjectId, type]);

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

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
        {type === "PERSONAL" && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddLessonDialogOpen(true)}
          >
            הוסף שיעור
          </Button>
        )}
      </Grid>

      {lessons.map((lesson) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={lesson.id}>
          <LessonItem
            key={lesson.id}
            lesson={lesson}
            onDelete={handleDeleteLesson}
            onUpdate={handleUpdateLesson}
            onPermissionChange={handlePermissionChange}
            type={type}
          />
        </Grid>
      ))}

      <AddLesson
        open={addLessonDialogOpen}
        onClose={() => setAddLessonDialogOpen(false)}
        subjectId={subjectId}
        onLessonAdded={() => {
          fetchLessons(); // ← זה יקרא מחדש את כל השיעורים מהשרת
        }}
      />

    </Grid>
  );
};

export default LessonsGrid;
