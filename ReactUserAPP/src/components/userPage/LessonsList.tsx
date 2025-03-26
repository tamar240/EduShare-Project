
import { useState, useEffect } from "react";
 import { Grid, Button, Dialog, DialogActions, DialogContent, TextField, FormControl, InputLabel, Select, MenuItem, DialogTitle } from "@mui/material";
 import AddIcon from "@mui/icons-material/Add";
 import axios from "axios";
 import { getCookie } from "../login/Login";
 import LessonItem, { Lesson } from "./LessonItem";

 interface LessonListProps {
  selectedSubjectLessons: Lesson[] | null;
  subjectId:number;
 }

 const LessonsGrid = ({ selectedSubjectLessons ,subjectId }: LessonListProps) => {
  const [lessons, setLessons] = useState<Lesson[]>(selectedSubjectLessons || []);
  const [addLessonDialogOpen, setAddLessonDialogOpen] = useState<boolean>(false);
  const [newLessonName, setNewLessonName] = useState<string>("");
  const [newLessonPermission, setNewLessonPermission] = useState<number>(0);

  useEffect(() => {
   if (selectedSubjectLessons) {
    setLessons(selectedSubjectLessons);
   }
  }, [selectedSubjectLessons]);

  const handleAddLesson = async () => {
   try {
    const token = getCookie("auth_token");
    debugger
    const response = await axios.post(
     "https://localhost:7249/api/Lesson",
     {
      name: newLessonName,
      subjectId: subjectId,
      permission: newLessonPermission,
     },
     { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );
    setLessons([...lessons, response.data]);
    setAddLessonDialogOpen(false);
    setNewLessonName("");
    setNewLessonPermission(0);
   } catch (error) {
    console.error("Failed to add lesson", error);
   }
  };

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

  if (!lessons) return null;

  return (
   <Grid container spacing={2} sx={{ mt: 2 }}>
    <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
     <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddLessonDialogOpen(true)}>
      הוסף שיעור
     </Button>
    </Grid>

    {lessons.map((lesson) => (
     <Grid item xs={12} sm={6} md={4} lg={3} key={lesson.id}>
      <LessonItem
       lesson={lesson}
       onDelete={handleDeleteLesson}
       onUpdate={handleUpdateLesson}
       onPermissionChange={handlePermissionChange}
      />
     </Grid>
    ))}

    <Dialog open={addLessonDialogOpen} onClose={() => setAddLessonDialogOpen(false)}>
     <DialogTitle>הוסף שיעור חדש</DialogTitle>
     <DialogContent>
      <TextField
       fullWidth
       margin="dense"
       label="שם השיעור"
       value={newLessonName}
       onChange={(e) => setNewLessonName(e.target.value)}
      />
      <FormControl fullWidth margin="dense">
       <InputLabel>הרשאה</InputLabel>
       <Select value={newLessonPermission} onChange={(e) => setNewLessonPermission(Number(e.target.value))}>
        <MenuItem value={0}>פרטי</MenuItem>
        <MenuItem value={1}>ציבורי</MenuItem>
       </Select>
      </FormControl>
     </DialogContent>
     <DialogActions>
      <Button onClick={() => setAddLessonDialogOpen(false)} color="primary">ביטול</Button>
      <Button onClick={handleAddLesson} color="secondary">הוסף</Button>
     </DialogActions>
    </Dialog>
   </Grid>
  );
 };

 export default LessonsGrid;
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { getCookie } from "../login/Login";
// import { Box, Menu, MenuItem, Typography, Grid, Paper, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from "@mui/material";
// import InfoIcon from '@mui/icons-material/Info';
// import LessonsList from "./LessonsList";

// export type Subject = {
//   id: number;
//   name: string;
//   ownerId: number;
//   createdAt: string;
//   updatedAt: string;
// };

// export type Lesson = {
//   id: number;
//   name: string;
//   createdAt: string;
//   updatedAt: string;
//   subjectId: number;
//   ownerId: number;
//   permission: number;
// };

// const UserFilesPage = () => {
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
//     const fetchSubjects = async () => {
//       try {
//         const token = getCookie("auth_token");
//         const response = await axios.get("https://localhost:7249/api/Subject/my", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setSubjects(response.data);
//       } catch (err) {
//         setError("Failed to fetch subjects");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSubjects();
//   }, []);

//   const handleShowLessons = async (subject: Subject) => {
//     if (!lessons[subject.id]) {
//       try {
//         const token = getCookie("auth_token");
//         const response = await axios.get<Lesson[]>(`https://localhost:7249/api/Lesson/my/${subject.id}`, {
//           headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//         });
//         setLessons((prev) => ({ ...prev, [subject.id]: response.data }));
//         setSelectedSubjectLessons(response.data);
//       } catch (err) {
//         console.error("Failed to fetch lessons", err);
//       }
//     } else {
//       setSelectedSubjectLessons(lessons[subject.id]);
//     }
//     setPage("lessons");
//     setSelectedSubject(subject);
//   };

//   const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, lesson: Lesson) => {
//     setMenuAnchor(event.currentTarget);
//     setSelectedLesson(lesson);
//   };

//   const handleMenuClose = () => {
//     setMenuAnchor(null);
//     setSelectedLesson(null);
//   };

//   const handleSubmitEdit = async () => {
//     if (!editLesson) return;
//     setLoadingUpdate(true);
//     try {
//       const token = getCookie("auth_token");
//       await axios.put(`https://localhost:7249/api/Lesson/${editLesson.id}`, editLesson, {
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//       });
//       setEditLesson(null);
//       handleMenuClose();
//     } catch (error) {
//       console.error("Failed to update lesson", error);
//     } finally {
//       setLoadingUpdate(false);
//     }
//   };

//   const handleCancelEdit = () => setEditLesson(null);

//   const handleBackToSubjects = () => {
//     setPage("subjects");
//     setSelectedSubject(null);
//     setSelectedSubjectLessons(null);
//   };

//   const handleEditSubject = (subject: Subject) => {
//     setEditingSubjectId(subject.id);
//     setEditedSubjectName(subject.name);
//   };

//   const handleSaveSubjectName = async (subject: Subject) => {
//     try {
//       const token = getCookie("auth_token");
//       await axios.put(`https://localhost:7249/api/Subject/${subject.id}`, { ...subject, name: editedSubjectName }, {
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//       });
//       setSubjects(subjects.map((s) => (s.id === subject.id ? { ...s, name: editedSubjectName } : s)));
//     } catch (error) {
//       console.error("Failed to update subject name", error);
//     }
//     setEditingSubjectId(null);
//   };

//   const handleSubjectDetails = () => {
//     setOpenDetailsDialog(true);
//   };

//   const toggleSubjectDetails = (id: number) => {
//     setExpandedSubjectDetails((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   return (
//     <Box sx={{ display: "flex", minHeight: "100vh" }}>
//       <Box sx={{ flexGrow: 1, p: 3 }}>
//         {page === "subjects" && (
//           <Grid container spacing={2}>
//             {subjects.map((subject) => (
//               <Grid item xs={12} sm={6} md={4} lg={3} key={subject.id}>
//                 <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                   {editingSubjectId === subject.id ? (
//                     <TextField
//                       value={editedSubjectName}
//                       onChange={(e) => setEditedSubjectName(e.target.value)}
//                       onBlur={() => handleSaveSubjectName(subject)}
//                       onKeyDown={(e) => {
//                         if (e.key === 'Enter') {
//                           handleSaveSubjectName(subject);
//                         }
//                       }}
//                       autoFocus
//                     />
//                   ) : (
//                     <Typography
//                       variant="h6"
//                       onDoubleClick={() => handleEditSubject(subject)}
//                       onClick={() => handleShowLessons(subject)}
//                     >
//                       {subject.name}
//                     </Typography>
//                   )}
//                   <IconButton onClick={() => toggleSubjectDetails(subject.id)}>
//                     <InfoIcon />
//                   </IconButton>
//                 </Paper>
//                 {expandedSubjectDetails[subject.id] && (
//                   <Box sx={{ mt: 1, ml: 2 }}>
//                     <Typography>Details for {subject.name}</Typography>
//                     {/* Add more details here */}
//                   </Box>
//                 )}
//               </Grid>
//             ))}
//           </Grid>
//         )}
//         {page === "lessons" && selectedSubject && (
//           <Box>
//             <Typography variant="h5" sx={{ mb: 2, cursor: "pointer" }} onClick={handleBackToSubjects}>
//               ⬅️ חזרה למקצועות
//             </Typography>
//             <LessonsList
//               handleMenuOpen={handleMenuOpen}
//               handleMenuClose={handleMenuClose}
//               handleSubmitEdit={handleSubmitEdit}
//               handleCancelEdit={handleCancelEdit}
//               selectedSubjectLessons={selectedSubjectLessons}
//               selectedLesson={selectedLesson}
//               editLesson={editLesson}
//               setEditLesson={setEditLesson}
//               loadingUpdate={loadingUpdate}
//             />
//           </Box>
//         )}
//       </Box>
//       <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
//         <MenuItem onClick={() => console.log("Download", selectedLesson)}>הורדה</MenuItem>
//         <MenuItem onClick={() => { setEditLesson(selectedLesson); handleMenuClose(); }}>פרטים</MenuItem>
//       </Menu>
//       <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)}>
//         <DialogTitle>פרטי מקצוע</DialogTitle>
//         <DialogContent>
//           {/* הצגת פרטי המקצוע */}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDetailsDialog(false)}>סגור</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default UserFilesPage;