// import { useState, useEffect } from "react";
// import axios from "axios";
// import { getCookie } from "./Login";
// import {
//   Drawer,
//   List,
//   ListItemButton,
//   ListItemText,
//   CircularProgress,
//   Box,
//   Typography,
//   IconButton,
//   Divider,
//   Menu,
//   MenuItem,
//   Grid,
//   Paper,
//   Collapse,
//   TextField,
//   Button,
// } from "@mui/material";
// import FolderIcon from "@mui/icons-material/Folder";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import InfoIcon from "@mui/icons-material/Info";

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
//   permission: string;
// };

// const UserFilesPage = () => {
//   const [subjects, setSubjects] = useState<Subject[]>([]);
//   const [lessons, setLessons] = useState<{ [key: number]: Lesson[] }>({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedSubjectLessons, setSelectedSubjectLessons] = useState<Lesson[] | null>(null);
//   const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
//   const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
//   const [lessonDetails, setLessonDetails] = useState<Lesson | null>(null);
//   const [expandedSubjectDetails, setExpandedSubjectDetails] = useState<{ [key: number]: boolean }>({});
//   const [editLesson, setEditLesson] = useState<Lesson | null>(null);
//   const [loadingUpdate, setLoadingUpdate] = useState(false);

//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const token = getCookie("auth_token");
//         const response = await axios.get<Subject[]>("https://localhost:7249/api/Subject/user", {
//           headers: {
//             Authorization: Bearer ${token},
//             'Content-Type': 'application/json'
//           },
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

//   const handleShowLessons = async (subjectId: number) => {
//     if (!lessons[subjectId]) {
//       try {
//         const token = getCookie("auth_token");
//         const response = await axios.get<Lesson[]>(https://localhost:7249/api/Lesson/my/${subjectId}, {
//           headers: {
//             Authorization: Bearer ${token},
//             'Content-Type': 'application/json'
//           },
//         });
//         setLessons(prev => ({ ...prev, [subjectId]: response.data }));
//         setSelectedSubjectLessons(response.data);
//       } catch (err) {
//         console.error("Failed to fetch lessons", err);
//       }
//     } else {
//       setSelectedSubjectLessons(lessons[subjectId]);
//     }
//   };

//   const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, lesson: Lesson) => {
//     setMenuAnchor(event.currentTarget);
//     setSelectedLesson(lesson);
//   };

//   const handleMenuClose = () => {
//     setMenuAnchor(null);
//     setSelectedLesson(null);
//   };

//   const handleShowLessonDetails = (lesson: Lesson) => {
//     setLessonDetails(lesson);
//     handleMenuClose(); // Close the menu after showing details
//   };

//   const toggleSubjectDetails = (subjectId: number) => {
//     setExpandedSubjectDetails(prev => ({
//       ...prev,
//       [subjectId]: !prev[subjectId],
//     }));
//   };

//   const handleSubmitEdit = async () => {
//     if (!editLesson) return;

//     setLoadingUpdate(true);
//     try {
//       const token = getCookie("auth_token");
//       await axios.put(https://localhost:7249/api/Lesson/${editLesson.id}, editLesson, {
//         headers: {
//           Authorization: Bearer ${token},
//           'Content-Type': 'application/json'
//         },
//       });
//       setLessonDetails(editLesson); // Update lesson details after edit
//       setEditLesson(null); // Close the edit form
//       handleMenuClose(); // Ensure the menu closes after edit
//     } catch (error) {
//       console.error("Failed to update lesson", error);
//     } finally {
//       setLoadingUpdate(false);
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditLesson(null); // Close the edit form
//   };

//   return (
//     <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#E3F2FD" }}>
//       <Drawer variant="permanent" sx={{ width: 260, flexShrink: 0, '& .MuiDrawer-paper': { width: 260, boxSizing: 'border-box', bgcolor: '#F5F5F5' } }}>
//         <Box sx={{ width: 240, p: 2 }}>
//           <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center" }}>מקצועות</Typography>
//           <Divider sx={{ mb: 2 }} />
//           {loading ? (
//             <CircularProgress sx={{ display: "block", mx: "auto", my: 2 }} />
//           ) : error ? (
//             <Typography color="error">{error}</Typography>
//           ) : (
//             <List>
//               {subjects.map((subject) => (
//                 <Box key={subject.id}>
//                   <ListItemButton onClick={() => handleShowLessons(subject.id)}>
//                     <FolderIcon sx={{ mr: 1 }} />
//                     <ListItemText primary={subject.name} />
//                     <IconButton onClick={() => toggleSubjectDetails(subject.id)}>
//                       <InfoIcon />
//                     </IconButton>
//                   </ListItemButton>
//                   <Collapse in={expandedSubjectDetails[subject.id]}>
//                     <Box sx={{ pl: 4, mb: 1 }}>
//                       <Typography variant="body2">נוצר בתאריך: {new Date(subject.createdAt).toLocaleString()}</Typography>
//                       <Typography variant="body2">עודכן בתאריך: {new Date(subject.updatedAt).toLocaleString()}</Typography>
//                     </Box>
//                   </Collapse>
//                 </Box>
//               ))}
//             </List>
//           )}
//         </Box>
//       </Drawer>
//       <Box sx={{ flexGrow: 1, p: 3 }}>
//         <Typography variant="h4">{selectedSubjectLessons ? "שיעורים" : "בחר מקצוע להצגת השיעורים"}</Typography>
//         {selectedSubjectLessons && (
//           <Grid container spacing={2} sx={{ mt: 2 }}>
//             {selectedSubjectLessons.map(lesson => (
//               <Grid item xs={12} sm={6} md={4} lg={3} key={lesson.id}>
//                 <Paper elevation={3} sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                   <Box>
//                     <Typography variant="subtitle1">{lesson.name}</Typography>
//                     <Typography variant="body2" color="text.secondary">{new Date(lesson.createdAt).toLocaleString()}</Typography>
//                   </Box>
//                   <IconButton onClick={(event) => handleMenuOpen(event, lesson)}>
//                     <MoreVertIcon />
//                   </IconButton>
//                 </Paper>
//               </Grid>
//             ))}
//           </Grid>
//         )}
//       </Box>
//       <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
//         <MenuItem onClick={() => console.log("Download", selectedLesson)}>הורדה</MenuItem>
//         <MenuItem onClick={() => { setEditLesson(selectedLesson); handleMenuClose(); }}>עריכה</MenuItem>
//         <MenuItem onClick={() => handleShowLessonDetails(selectedLesson!)}>פרטים</MenuItem>
//       </Menu>
//       <Drawer anchor="right" open={!!editLesson} onClose={handleCancelEdit}>
//         <Box sx={{ width: 400, p: 3 }}>
//           <Typography variant="h6">עריכת שיעור</Typography>
//           <Divider sx={{ my: 2 }} />
//           {editLesson && (
//             <Box component="form">
//               <TextField
//                 label="שם השיעור"
//                 variant="outlined"
//                 fullWidth
//                 value={editLesson.name}
//                 onChange={(e) => setEditLesson({ ...editLesson, name: e.target.value })}
//                 sx={{ mb: 2 }}
//               />
//               <TextField
//                 label="ID מקצוע"
//                 variant="outlined"
//                 fullWidth
//                 value={editLesson.subjectId}
//                 onChange={(e) => setEditLesson({ ...editLesson, subjectId: parseInt(e.target.value) })}
//                 sx={{ mb: 2 }}
//               />
//               <TextField
//                 label="ID בעלים"
//                 variant="outlined"
//                 fullWidth
//                 value={editLesson.ownerId}
//                 onChange={(e) => setEditLesson({ ...editLesson, ownerId: parseInt(e.target.value) })}
//                 sx={{ mb: 2 }}
//               />
//               <TextField
//                 label="הרשאה"
//                 variant="outlined"
//                 fullWidth
//                 value={editLesson.permission}
//                 onChange={(e) => setEditLesson({ ...editLesson, permission: e.target.value })}
//                 sx={{ mb: 2 }}
//               />
//               <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                 <Button onClick={handleCancelEdit}>ביטול</Button>
//                 <Button onClick={handleSubmitEdit} disabled={loadingUpdate}>
//                   {loadingUpdate ? <CircularProgress size={24} /> : "שמור"}
//                 </Button>
//               </Box>
//             </Box>
//           )}
//         </Box>
//       </Drawer>
//     </Box>
//   );
// };

// export default UserFilesPage;