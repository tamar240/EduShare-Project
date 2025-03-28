import { useState } from "react";
import { Grid, Button } from "@mui/material";
import LessonsGrid from "./foldersAndFilesPage/LessonsList";
import { Subject } from "./typies/types";


interface SubjectsListProps {
  subjects: Subject[];
  onShowLessons: (subjectId: number) => void;
  type: "PUBLIC" | "PERSONAL";
}

const SubjectsList: React.FC<SubjectsListProps> = ({ subjects, onShowLessons, type }) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const handleShowLessons = (subjectId: number) => {
    setSelectedSubject(subjects.find(subject => subject.id === subjectId) || null);
    onShowLessons(subjectId); // מבצע קריאה ל-onShowLessons
  };

  return (
    <div>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {subjects.map((subject) => (
          <Grid item xs={12} sm={6} md={4} key={subject.id}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleShowLessons(subject.id)}
            >
              {subject.name}
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* הצגת שיעורים אם ישנם */}
      {selectedSubject && (
        <LessonsGrid
          subjectId={selectedSubject.id}
          
          type={type}
        />
      )}
    </div>
  );
};

export default SubjectsList;




