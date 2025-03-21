import { Grid, Paper, Box, Typography, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Lesson } from "./UserFilesPage";

interface LessonListProps {
  selectedSubjectLessons: Lesson[] | null;
  handleMenuOpen: (event: React.MouseEvent<HTMLButtonElement>, lesson: Lesson) => void;
}

const LessonList = ({ selectedSubjectLessons, handleMenuOpen }: LessonListProps) => {
  if (!selectedSubjectLessons) return null;

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {selectedSubjectLessons.map(lesson => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={lesson.id}>
          <Paper elevation={3} sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="subtitle1">{lesson.name}</Typography>
              <Typography variant="body2" color="text.secondary">{new Date(lesson.createdAt).toLocaleString()}</Typography>
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
