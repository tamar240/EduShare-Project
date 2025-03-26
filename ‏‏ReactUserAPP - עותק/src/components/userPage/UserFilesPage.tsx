import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "../login/Login";
import { Box, Drawer, Menu, MenuItem } from "@mui/material";
import SubjectList from "./SubjectList";
import LessonsList from "./LessonsList";

export type Subject = {
  id: number;
  name: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
};

export type Lesson = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  subjectId: number;
  ownerId: number;
  permission: number;
};

const UserFilesPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [lessons, setLessons] = useState<{ [key: number]: Lesson[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubjectLessons, setSelectedSubjectLessons] = useState<Lesson[] | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [editLesson, setEditLesson] = useState<Lesson | null>(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [expandedSubjectDetails, setExpandedSubjectDetails] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchSubjects = async () => {
      try {

        const token = getCookie("auth_token");
        const response = await axios.get("https://localhost:7249/api/Subject/my", {
          headers: {
            'Authorization': `Bearer ${token}`,
            //'Content-Type': 'application/json'
          },
        });
        setSubjects(response.data);
      } catch (err) {
        setError("Failed to fetch subjects");
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const handleShowLessons = async (subjectId: number) => {
    if (!lessons[subjectId]) {
      try {
        const token = getCookie("auth_token");
        const response = await axios.get<Lesson[]>(`https://localhost:7249/api/Lesson/my/${subjectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        setLessons(prev => ({ ...prev, [subjectId]: response.data }));
        setSelectedSubjectLessons(response.data);
      } catch (err) {
        console.error("Failed to fetch lessons", err);
      }
    } else {
      setSelectedSubjectLessons(lessons[subjectId]);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, lesson: Lesson) => {
    setMenuAnchor(event.currentTarget);
    setSelectedLesson(lesson);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedLesson(null);
  };

  const handleSubmitEdit = async () => {
    if (!editLesson) return;
    setLoadingUpdate(true);
    try {
      const token = getCookie("auth_token");
      await axios.put(`https://localhost:7249/api/Lesson/${editLesson.id}`, editLesson, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      setEditLesson(null);
      handleMenuClose();
    } catch (error) {
      console.error("Failed to update lesson", error);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleCancelEdit = () => setEditLesson(null);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>

      <Drawer variant="permanent" sx={{ width: 260, flexShrink: 0, '& .MuiDrawer-paper': { width: 260, boxSizing: 'border-box', bgcolor: '#F5F5F5' } }}>
        <SubjectList
          subjects={subjects}
          loading={loading}
          error={error}
          handleShowLessons={handleShowLessons}
          expandedSubjectDetails={expandedSubjectDetails}
          toggleSubjectDetails={(id) => setExpandedSubjectDetails(prev => ({ ...prev, [id]: !prev[id] }))}
        />
      </Drawer>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <LessonsList handleMenuOpen={handleMenuOpen} selectedSubjectLessons={selectedSubjectLessons } />
      </Box>
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={() => console.log("Download", selectedLesson)}>הורדה</MenuItem>
        <MenuItem onClick={() => { setEditLesson(selectedLesson); handleMenuClose(); }}>פרטים</MenuItem>
      </Menu>
      {/* <LessonDetails
        lesson={selectedLesson}
        editLesson={editLesson}
        setEditLesson={setEditLesson}
        handleSubmitEdit={handleSubmitEdit}
        handleCancelEdit={handleCancelEdit}
        loadingUpdate={loadingUpdate}
      /> */}
    </Box>
  );
};

export default UserFilesPage;
// import { useState, useEffect } from "react";
//  import axios from "axios";
//  import { getCookie } from "../login/Login";
//  import { Box, Menu, MenuItem, Typography, Grid, Paper, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
//  import LessonsList from "./LessonsList";

//  export type Subject = {
//   id: number;
//   name: string;
//   ownerId: number;
//   createdAt: string;
//   updatedAt: string;
//  };

//  export type Lesson = {
//   id: number;
//   name: string;
//   createdAt: string;
//   updatedAt: string;
//   subjectId: number;
//   ownerId: number;
//   permission: number;
//  };

//  const UserFilesPage = () => {
//   const [subjects, setSubjects] = useState<Subject[]>([]);
//   const [lessons, setLessons] = useState<{ [key: number]: Lesson[] }>({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedSubjectLessons, setSelectedSubjectLessons] = useState<Lesson[] | null>(null);
//   const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
//   const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
//   const [editLesson, setEditLesson] = useState<Lesson | null>(null);
//   const [loadingUpdate, setLoadingUpdate] = useState(false);
//   const [page, setPage] = useState<"subjects" | "lessons">("subjects");
//   const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
//   const [editingSubjectId, setEditingSubjectId] = useState<number | null>(null);
//   const [editedSubjectName, setEditedSubjectName] = useState<string>("");
//   const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
//   const [expandedSubjectDetails, setExpandedSubjectDetails] = useState<{ [key: number]: boolean }>({});

//   useEffect(() => {
//   const fetchSubjects = async () => {
//    try {
//     const token = getCookie("auth_token");
//     const response = await axios.get("https://localhost:7249/api/Subject/my", {
//      headers: { Authorization: `Bearer ${token}` },
//     });
//     setSubjects(response.data);
//    } catch (err) {
//     setError("Failed to fetch subjects");
//    } finally {
//     setLoading(false);
//    }
//   };
//   fetchSubjects();
//   }, []);

//   const handleShowLessons = async (subject: Subject) => {
//   if (!lessons[subject.id]) {
//    try {
//     const token = getCookie("auth_token");
//     const response = await axios.get<Lesson[]>(`https://localhost:7249/api/Lesson/my/${subject.id}`, {
//      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//     });
//     setLessons(prev => ({ ...prev, [subject.id]: response.data }));
//     setSelectedSubjectLessons(response.data);
//    } catch (err) {
//     console.error("Failed to fetch lessons", err);
//    }
//   } else {
//    setSelectedSubjectLessons(lessons[subject.id]);
//   }
//   setPage("lessons");
//   setSelectedSubject(subject);
//   };

//   const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, lesson: Lesson) => {
//   setMenuAnchor(event.currentTarget);
//   setSelectedLesson(lesson);
//   };

//   const handleMenuClose = () => {
//   setMenuAnchor(null);
//   setSelectedLesson(null);
//   };

//   const handleSubmitEdit = async () => {
//   if (!editLesson) return;
//   setLoadingUpdate(true);
//   try {
//    const token = getCookie("auth_token");
//    await axios.put(`https://localhost:7249/api/Lesson/${editLesson.id}`, editLesson, {
//     headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//    });
//    setEditLesson(null);
//    handleMenuClose();
//   } catch (error) {
//    console.error("Failed to update lesson", error);
//   } finally {
//    setLoadingUpdate(false);
//   }
//   };

//   const handleCancelEdit = () => setEditLesson(null);

//   const handleBackToSubjects = () => {
//   setPage("subjects");
//   setSelectedSubject(null);
//   setSelectedSubjectLessons(null);
//   };

//   const handleEditSubject = (subject: Subject) => {
//   setEditingSubjectId(subject.id);
//   setEditedSubjectName(subject.name);
//   };

//   const handleSaveSubjectName = async (subject: Subject) => {
//   try {
//    const token = getCookie("auth_token");
//    await axios.put(`https://localhost:7249/api/Subject/${subject.id}`, { ...subject, name: editedSubjectName }, {
//     headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//    });
//    setSubjects(subjects.map(s => s.id === subject.id ? { ...s, name: editedSubjectName } : s));
//   } catch (error) {
//    console.error("Failed to update subject name", error);
//   }
//   setEditingSubjectId(null);
//   };

//   const handleSubjectDetails = () => {
//   setOpenDetailsDialog(true);
//   };

//   const toggleSubjectDetails = (id: number) => {
//   setExpandedSubjectDetails(prev => ({ ...prev, [id]: !prev[id] }));
//   };

//   return (
//   <Box sx={{ display: "flex", minHeight: "100vh" }}>
//    <Box sx={{ flexGrow: 1, p: 3 }}>
//     {page === "subjects" && (
//      <Grid container spacing={2}>
//       {subjects.map((subject) => (
//        <Grid item xs={12} sm={6} md={4} lg={3} key={subject.id}>
//         <Paper elevation={3} sx={{ p: 2, cursor: "pointer" }}>
//          {editingSubjectId === subject.id ? (
//           <TextField
//            value={editedSubjectName}
//            onChange={(e) => setEditedSubjectName(e.target.value)}
//            onBlur={() => handleSaveSubjectName(subject)}
//            autoFocus
//           />
//          ) : (
//           <Typography variant="h6" onClick={() => handleShowLessons(subject)}>
//            {subject.name}
//           </Typography>
//          )}
//          <Button onClick={() => handleEditSubject(subject)}>ערוך</Button>
//          <Button onClick={handleSubjectDetails}>פרטים</Button>
//         </Paper>
//        </Grid>
//       ))}
//      </Grid>
//     )}
//     {page === "lessons" && selectedSubject && (
//      <Box>
//       <Typography variant="h5" sx={{ mb: 2, cursor: "pointer" }} onClick={handleBackToSubjects}>
//        ⬅️ חזרה למקצועות
//       </Typography>
//       <LessonsList
//        handleMenuOpen={handleMenuOpen}
//        handleMenuClose={handleMenuClose}
//        handleSubmitEdit={handleSubmitEdit}
//        handleCancelEdit={handleCancelEdit}
//        selectedSubjectLessons={selectedSubjectLessons}
//        selectedLesson={selectedLesson}
//        editLesson={editLesson}
//        setEditLesson={setEditLesson}
//        loadingUpdate={loadingUpdate}
//       />
//      </Box>
//     )}
//    </Box>
//    <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
//     <MenuItem onClick={() => console.log("Download", selectedLesson)}>הורדה</MenuItem>
//     <MenuItem onClick={() => { setEditLesson(selectedLesson); handleMenuClose(); }}>פרטים</MenuItem>
//    </Menu>
//    <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)}>
//     <DialogTitle>פרטי מקצוע</DialogTitle>
//     <DialogContent>
//      {/* הצגת פרטי המקצוע */}
//     </DialogContent>
//     <DialogActions>
//      <Button onClick={() => setOpenDetailsDialog(false)}>סגור</Button>
//     </DialogActions>
//    </Dialog>
//   </Box>
//   );
//  };

//  export default UserFilesPage;