import { useState } from "react";
import { Grid, Button, Box } from "@mui/material";
import LessonsGrid from "./foldersAndFilesPage/LessonsList";
import { Subject } from "./typies/types";

import folderImage from '../assets/folder2.png';
import "../styles/style.css";// Import the CSS file for styling

interface SubjectsListProps {
  subjects: Subject[];
  onShowLessons: (subjectId: number) => void;
  type: "PUBLIC" | "PERSONAL";
}

const SubjectsList: React.FC<SubjectsListProps> = ({ subjects, onShowLessons, type }) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const handleShowLessons = (subjectId: number) => {
    setSelectedSubject(subjects.find(subject => subject.id === subjectId) || null);
    onShowLessons(subjectId);
  };

  return (
    // <div>
    //   <Grid container spacing={4} sx={{ mt: 4 }}>
    //     {subjects.map((subject) => (
    //       <Grid item xs={18} sm={8} md={2} key={subject.id} className="subject-grid-item">
    //         <Button
    //           variant="text" // במקום "outlined"              fullWidth
    //           onClick={() => handleShowLessons(subject.id)}
    //         >
    //           <Box>
    //             <img
    //               src={folderImage}
    //               alt="Folder"
    //             />
    //             <span >{subject.name}</span>
    //           </Box>
    //         </Button>
    //       </Grid>
    //     ))}
    //   </Grid>

    //   {selectedSubject && (
    //     <LessonsGrid subjectId={selectedSubject.id} type={type} />
    //   )}
    // </div>
    <div>
  <Grid container spacing={4} sx={{ mt: 4 }}>
    {subjects.map((subject) => (
      <Grid 
        item 
        xs={18} sm={8} md={2} 
        key={subject.id} 
        sx={{ textAlign: "center", width: "150px" }} // ממרכז את התוכן
      >
        <Button
          variant="text"
          fullWidth
          onClick={() => handleShowLessons(subject.id)}
          sx={{ padding: 0, minWidth: "auto" }} // מסיר שוליים ושומר על גודל מתאים
        >
          <Box>
            <img
              src={folderImage}
              alt="Folder"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          </Box>
        </Button>
        <div 
          style={{
            marginTop: "5px",
            fontSize: "16px",
            fontFamily: '"Roboto", sans-serif',
            color: "black",
            textAlign: "center"
          }}
        >
          {subject.name}
        </div>
      </Grid>
    ))}
  </Grid>

  {selectedSubject && (
    <LessonsGrid subjectId={selectedSubject.id} type={type} />
  )}
</div>

  );
};

export default SubjectsList;
