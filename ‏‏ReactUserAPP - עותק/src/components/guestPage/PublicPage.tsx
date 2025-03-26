import { useState } from "react";
import { Container, Grid } from "@mui/material";
import PublicLessonsList from "./PublicLessonsList";
import SubjectList from "../userPage/SubjectList"; // שינוי השם כך שיתאים לייצוא

const PublicPage = () => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [expandedSubjectDetails, setExpandedSubjectDetails] = useState<{ [key: number]: boolean }>({});

  // פונקציה שמעדכנת את ה- selectedSubjectId
  const handleShowLessons = (subjectId: number) => {
    setSelectedSubjectId(subjectId);
  };

  // פונקציה לטיפול בהרחבת פרטים
  const toggleSubjectDetails = (subjectId: number) => {
    setExpandedSubjectDetails((prev) => ({
      ...prev,
      [subjectId]: !prev[subjectId],
    }));
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <SubjectList 
            subjects={[]} // יש להביא את רשימת המקצועות מ-API חיצוני
            loading={false} 
            error={null}
            handleShowLessons={handleShowLessons} 
            expandedSubjectDetails={expandedSubjectDetails} 
            toggleSubjectDetails={toggleSubjectDetails}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <PublicLessonsList subjectId={selectedSubjectId} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default PublicPage;
