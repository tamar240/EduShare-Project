import { useState } from "react";
import { List, ListItemButton, ListItemText, IconButton, Collapse, Box, Typography, Divider, TextField } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InfoIcon from "@mui/icons-material/Info";
import { Subject } from "../UserFilesPage";
import axios from "axios";
import { getCookie } from "../login/Login";

interface SubjectListProps {
  subjects: Subject[];
  loading: boolean;
  error: string | null;
  handleShowLessons: (subjectId: number) => void;
  expandedSubjectDetails: { [key: number]: boolean };
  toggleSubjectDetails: (subjectId: number) => void;
}

const SubjectList = ({ subjects, loading, error, handleShowLessons, expandedSubjectDetails, toggleSubjectDetails }: SubjectListProps) => {
  const [editingSubjectId, setEditingSubjectId] = useState<number | null>(null);
  const [subjectName, setSubjectName] = useState<string>("");

  const handleDoubleClick = (subject: Subject) => {
    setEditingSubjectId(subject.id);
    setSubjectName(subject.name);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubjectName(event.target.value);
  };

  const handleBlur = async (subject: Subject) => {
    if (subjectName.trim() !== "" && subjectName !== subject.name) {
      try {
        const token = getCookie("auth_token");
        debugger
        await axios.put(`https://localhost:7249/api/Subject/${subject.id}`, { ...subject, name: subjectName }, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        subject.name = subjectName;
      } catch (error) {
        console.error("Failed to update subject", error);
      }
    }
    
    // יציאה ממצב עריכה והסרת הפוקוס
    setEditingSubjectId(null);
    setTimeout(() => {
      const activeElement = document.activeElement;
      if (activeElement && "blur" in activeElement) {
        (activeElement as HTMLElement).blur(); // במקרה של רכיב עם blur
      }
    }, 0);
    
  };
  

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>, subject: Subject) => {
    if (event.key === "Enter") {
      handleBlur(subject);
    }
  };

  return (
    <Box sx={{ width: 240, p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center" }}>מקצועות</Typography>
      <Divider sx={{ mb: 2 }} />
      {loading ? (
        <Typography color="text.secondary">טוען...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <List>
          {subjects.map((subject) => (
            <Box key={subject.id}>
              <ListItemButton onClick={() => handleShowLessons(subject.id)}>
                <FolderIcon sx={{ mr: 1 }} />
                {editingSubjectId === subject.id ? (
                  <TextField
                    value={subjectName}
                    onChange={handleChange}
                    onBlur={() => handleBlur(subject)}
                    onKeyDown={(event) => handleKeyPress(event as React.KeyboardEvent<HTMLInputElement>, subject)}
                    autoFocus
                    variant="standard"
                    fullWidth
                  />
                ) : (
                  <ListItemText primary={subject.name} onDoubleClick={() => handleDoubleClick(subject)} />
                )}
                <IconButton onClick={() => toggleSubjectDetails(subject.id)}>
                  <InfoIcon />
                </IconButton>
              </ListItemButton>
              <Collapse in={expandedSubjectDetails[subject.id]}>
                <Box sx={{ pl: 4, mb: 1 }}>
                  <Typography variant="body2">נוצר בתאריך: {new Date(subject.createdAt).toLocaleString()}</Typography>
                  <Typography variant="body2">עודכן בתאריך: {new Date(subject.updatedAt).toLocaleString()}</Typography>
                </Box>
              </Collapse>
            </Box>
          ))}
        </List>
      )}
    </Box>
  );
};

export default SubjectList;
