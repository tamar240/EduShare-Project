
import { useState, MouseEvent } from "react";
import { Grid, Button, Box, TextField,  } from "@mui/material";
import axios from "axios";
import LessonsGrid from "./foldersAndFilesPage/LessonsList";
import { Subject } from "./typies/types";


import folderImage from '../assets/folder2.png';
import "../styles/style.css"; // Import the CSS file for styling
import { getCookie } from "./login/Login";
import SubjectContextMenu from "./foldersAndFilesPage/SubjectContextMenu";

interface SubjectsListProps {
  subjects: Subject[];
  onShowLessons: (subjectId: number) => void;
  type: "PUBLIC" | "PERSONAL";
}

const SubjectsList: React.FC<SubjectsListProps> = ({ subjects, onShowLessons, type }) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [editingSubjectId, setEditingSubjectId] = useState<number | null>(null);
  const [newSubjectName, setNewSubjectName] = useState<string>("");
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; subjectId: number } | null>(null);

  const handleShowLessons = (subjectId: number) => {
    setSelectedSubject(subjects.find(subject => subject.id === subjectId) || null);
    onShowLessons(subjectId);
  };

  const handleDoubleClick = (subject: Subject) => {
    setEditingSubjectId(subject.id);
    setNewSubjectName(subject.name);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewSubjectName(event.target.value);
  };

  const handleUpdateSubject = async (subject: Subject) => {
    if (!newSubjectName.trim() || newSubjectName === subject.name) {
      setEditingSubjectId(null);
      return;
    }

    const updatedSubject = {
      ...subject,
      name: newSubjectName,
      updatedAt: new Date().toISOString()
    };

    try {
      const token = getCookie("auth_token"); // שליפת הטוקן מהעוגיות
      await axios.put(`https://localhost:7249/api/Subject/${subject.id}`, updatedSubject, {
        headers: { Authorization: `Bearer ${token}` },
      });

      subject.name = newSubjectName; // עדכון השם המקומי
    } catch (error) {
      console.error("Error updating subject:", error);
    }

    setEditingSubjectId(null);
  };

  const handleContextMenu = (event: MouseEvent, subjectId: number) => {
    event.preventDefault();
    setContextMenu({ mouseX: event.clientX, mouseY: event.clientY, subjectId });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  return (
    <div>
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {subjects.map((subject) => (
          <Grid 
            item 
            xs={18} sm={8} md={2} 
            key={subject.id} 
            sx={{ textAlign: "center", width: "150px" }} 
            onContextMenu={(e) => handleContextMenu(e, subject.id)} // הוספת תפריט קונטקסט בלחיצה ימנית
          >
            <Button
              variant="text"
              fullWidth
              onClick={() => handleShowLessons(subject.id)}
              sx={{ padding: 0, minWidth: "auto" }}
            >
              <Box>
                <img
                  src={folderImage}
                  alt="Folder"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              </Box>
            </Button>

            { type === 'PERSONAL' &&editingSubjectId === subject.id ?  (
              <TextField
                value={newSubjectName}
                onChange={handleChange}
                onBlur={() => handleUpdateSubject(subject)}
                onKeyDown={(e) => e.key === "Enter" && handleUpdateSubject(subject)}
                autoFocus
                size="small"
                variant="outlined"
                sx={{ 
                  marginTop: "5px", 
                  textAlign: "center",
                  maxWidth: "100px"
                }}
              />
            ) : (
              <div
                style={{
                  marginTop: "5px",
                  fontSize: "16px",
                  fontFamily: '"Roboto", sans-serif',
                  color: "black",
                  textAlign: "center",
                  cursor: "pointer",
                  maxWidth: "100px",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal"
                }}
                onDoubleClick={() => handleDoubleClick(subject)}
              >
                {subject.name}
              </div>
            )}
          </Grid>
        ))}
      </Grid>

      {/* תפריט קונטקסט (ימני) */}
      {contextMenu && (
        <SubjectContextMenu
          mouseX={contextMenu.mouseX}
          mouseY={contextMenu.mouseY}
          subjectId={contextMenu.subjectId}
          onClose={handleCloseContextMenu}
        />
      )}

      {selectedSubject && <LessonsGrid subjectId={selectedSubject.id} type={type} />}
    </div>
  );
};

export default SubjectsList;
