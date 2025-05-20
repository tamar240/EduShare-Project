
import { useState, MouseEvent } from "react";
import { Grid, Button, Box, TextField, MenuItem, Select, IconButton } from "@mui/material";
import axios from "axios";
import LessonsGrid from "./foldersAndFilesPage/LessonsList";
import { Subject } from "./typies/types";
import folderImage from '../assets/folder2.png';
import "../styles/style.css";
import { getCookie } from "./login/Login";
import SubjectContextMenu from "./foldersAndFilesPage/SubjectContextMenu";
import ClearIcon from '@mui/icons-material/Clear';

interface SubjectsListProps {
  subjects: Subject[];
  onShowLessons: (subjectId: number) => void;
  type: "PUBLIC" | "PERSONAL";
}

const SubjectsList: React.FC<SubjectsListProps> = ({ subjects, onShowLessons, type }) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [editingSubjectId, setEditingSubjectId] = useState<number | null>(null);
  const [newSubjectName, setNewSubjectName] = useState<string>("");
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; subject: Subject } | null>(null);
  const [sortBy, setSortBy] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const baseUrl = import.meta.env.VITE_API_URL;


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
      const token = getCookie("auth_token"); 
      await axios.put(`${baseUrl}/api/Subject/${subject.id}`, updatedSubject, {
        headers: { Authorization: `Bearer ${token}` },
      });

      subject.name = newSubjectName;
    } catch (error) {
      console.error("Error updating subject:", error);
    }

    setEditingSubjectId(null);
  };

  const handleContextMenu = (event: MouseEvent, subject: Subject) => {
    event.preventDefault();
    setContextMenu({ mouseX: event.clientX, mouseY: event.clientY, subject });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const filteredSubjects = subjects
    .filter(subject => subject.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "updatedAt") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      if (sortBy === "ownerId") {
        return a.ownerId - b.ownerId;
      }
      return 0;
    });

  return (
    <Box className="px-4 md:px-8 lg:px-16 py-4">
      {/* סינון ומיון */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems="center"
        gap={2}
        sx={{ mb: 4 }}
      >
        <TextField
          label="חיפוש לפי שם מקצוע"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
          sx={{ maxWidth: 300 }}
        />
  
        <Select
          value={sortBy}
          onChange={handleSortChange}
          displayEmpty
          size="small"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">ללא מיון</MenuItem>
          <MenuItem value="updatedAt">מיון לפי תאריך עדכון</MenuItem>
          <MenuItem value="ownerId">מיון לפי בעלים</MenuItem>
        </Select>
  
        {(sortBy || searchTerm) && (
          <IconButton onClick={() => { setSortBy(""); setSearchTerm(""); }}>
            <ClearIcon />
          </IconButton>
        )}
      </Box>
  
      {/* הצגת המקצועות */}
      <Grid container spacing={4} justifyContent="flex-start">
        {filteredSubjects.map((subject) => (
          <Grid
            item
            xs={6}
            sm={4}
            md={2.4}
            lg={2}
            key={subject.id}
            onContextMenu={(e) => handleContextMenu(e, subject)}
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              className="transition-all duration-200 hover:scale-105"
            >
              <Button
                variant="text"
                onClick={() => handleShowLessons(subject.id)}
                sx={{ padding: 0, minWidth: "auto" }}
              >
                <img
                  src={folderImage}
                  alt="Folder"
                  style={{
                    width: "90px",
                    height: "90px",
                    objectFit: "cover",
                  }}
                />
              </Button>
  
              {type === 'PERSONAL' && editingSubjectId === subject.id ? (
                <TextField
                  value={newSubjectName}
                  onChange={handleChange}
                  onBlur={() => handleUpdateSubject(subject)}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdateSubject(subject)}
                  autoFocus
                  size="small"
                  variant="outlined"
                  sx={{
                    marginTop: "6px",
                    textAlign: "center",
                    maxWidth: "100px",
                    width: "100%"
                  }}
                />
              ) : (
                <div
                  style={{
                    marginTop: "6px",
                    fontSize: "15px",
                    fontWeight: 500,
                    fontFamily: '"Roboto", sans-serif',
                    color: "#333",
                    textAlign: "center",
                    cursor: "pointer",
                    maxWidth: "100px",
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                    lineHeight: 1.2
                  }}
                  onDoubleClick={() => handleDoubleClick(subject)}
                >
                  {subject.name}
                </div>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
  
      {/* תפריט הקשר */}
      {contextMenu && (
        <SubjectContextMenu
          mouseX={contextMenu.mouseX}
          mouseY={contextMenu.mouseY}
          subject={contextMenu.subject}
          onClose={handleCloseContextMenu}
          type={type}
        />
      )}
  
      {/* גריד של שיעורים */}
      {selectedSubject && (
        <LessonsGrid
          subjectId={selectedSubject.id}
          type={type}
          selectedSubjectLessons={null}
        />
      )}
    </Box>
  );
  
};

export default SubjectsList;
