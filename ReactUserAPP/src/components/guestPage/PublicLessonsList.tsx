import { useEffect, useState } from "react";
import { Grid, Paper, Box, Typography, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";

interface PublicLesson {
  id: number;
  name: string;
  createdAt: string;
  ownerName: string;
}

interface PublicLessonsListProps {
  subjectId: number | null;
}

const PublicLessonsList = ({ subjectId }: PublicLessonsListProps) => {
  const [lessons, setLessons] = useState<PublicLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedLesson, setSelectedLesson] = useState<PublicLesson | null>(null);

  useEffect(() => {
    if (!subjectId) return;

    const fetchPublicLessons = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://localhost:7249/api/Lesson/public?subjectId=${subjectId}`);
        setLessons(response.data);
      } catch (err) {
        setError("לא ניתן לטעון שיעורים ציבוריים");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicLessons();
  }, [subjectId]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, lesson: PublicLesson) => {
    setMenuAnchor(event.currentTarget);
    setSelectedLesson(lesson);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  if (!subjectId) return <Typography>בחר מקצוע כדי להציג שיעורים</Typography>;
  if (loading) return <Typography>טוען שיעורים...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {lessons.map((lesson) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={lesson.id}>
          <Paper elevation={3} sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1">{lesson.name}</Typography>
              <Typography variant="body2" color="text.secondary">מורה: {lesson.ownerName}</Typography>
            </Box>
            <IconButton onClick={(event) => handleMenuOpen(event, lesson)}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
              <MenuItem>⬇️ הורדה</MenuItem>
              <Tooltip
                title={
                  <Box sx={{ textAlign: "right", p: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">פרטי שיעור</Typography>
                    <Typography variant="body2">שם: {selectedLesson?.name ?? "לא ידוע"}</Typography>
                    <Typography variant="body2">נוצר בתאריך: {selectedLesson?.createdAt ?? "לא ידוע"}</Typography>
                    <Typography variant="body2">מורה: {selectedLesson?.ownerName ?? "לא ידוע"}</Typography>
                  </Box>
                }
                placement="left"
                arrow
              >
                <MenuItem>⬅️ פרטים</MenuItem>
              </Tooltip>
            </Menu>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default PublicLessonsList;
