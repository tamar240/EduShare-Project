// import React, { useState, useEffect } from 'react';
// import { Drawer, List, ListItem, ListItemText, Divider, Box, Typography } from '@mui/material';
// import axios from 'axios';
// import { useQuery } from '@tanstack/react-query';
// import { getCookie } from './Login';

// // פונקציה לשליפת מקצועות
// const fetchSubjects = async () => {
//   const token = getCookie("auth_token");  // שליפת ה-Token מ-localStorage
//   const response = await axios.get('https://localhost:7249/api/Subject', {
//     headers: {
//       Authorization: `Bearer ${token}`,  // הוספת ה-Token לכותרת ה-Authorization
//     },
//   });
//   return response.data;
// };

// // פונקציה לשליפת שיעורים לפי מקצוע
// const fetchLessonsBySubject = async (subjectId: any) => {
//   const token = localStorage.getItem('authToken');  // שליפת ה-Token מ-localStorage
//   const response = await axios.get(`/api/lesson/my/${subjectId}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,  // הוספת ה-Token לכותרת ה-Authorization
//     },
//   });
//   return response.data;
// };

// const Sidebar = ({ onCourseClick }) => {
//   const { data: subjects, isLoading, error } = useQuery(['subjects'], fetchSubjects);

//   if (isLoading) return <Typography variant="h6">טוען מקצועות...</Typography>;
//   if (error) return <Typography variant="h6">הייתה שגיאה בטעינת המקצועות.</Typography>;

//   return (
//     <Drawer
//       sx={{
//         width: 250,
//         flexShrink: 0,
//         '& .MuiDrawer-paper': {
//           width: 250,
//           boxSizing: 'border-box',
//         },
//       }}
//       variant="permanent"
//       anchor="left"
//     >
//       <Box sx={{ padding: 2 }}>
//         <Typography variant="h6">מקצועות</Typography>
//       </Box>
//       <Divider />
//       <List>
//         {subjects.map((subject) => (
//           <ListItem button key={subject.id} onClick={() => onCourseClick(subject)}>
//             <ListItemText primary={subject.name} />
//           </ListItem>
//         ))}
//       </List>
//     </Drawer>
//   );
// };

// const MainContent = ({ selectedSubject }) => {
//   const { data: lessons, isLoading, error } = useQuery(
//     ['lessons', selectedSubject?.id],
//     () => fetchLessonsBySubject(selectedSubject.id),
//     { enabled: !!selectedSubject }  // רק אם יש מקצוע נבחר
//   );

//   if (!selectedSubject) {
//     return (
//       <Box sx={{ padding: 3 }}>
//         <Typography variant="h5">בחר מקצוע כדי לראות את השיעורים</Typography>
//       </Box>
//     );
//   }

//   if (isLoading) {
//     return <Typography variant="h6">טוען שיעורים...</Typography>;
//   }

//   if (error) {
//     return <Typography variant="h6">הייתה שגיאה בטעינת השיעורים.</Typography>;
//   }

//   return (
//     <Box sx={{ padding: 3 }}>
//       <Typography variant="h4">{selectedSubject.name}</Typography>
//       <List>
//         {lessons.map((lesson) => (
//           <ListItem button key={lesson.id}>
//             <ListItemText primary={lesson.name} />
//           </ListItem>
//         ))}
//       </List>
//     </Box>
//   );
// };

// const App = () => {
//   const [selectedSubject, setSelectedSubject] = useState(null);

//   const handleCourseClick = (subject) => {
//     setSelectedSubject(subject);
//   };

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <Sidebar onCourseClick={handleCourseClick} />
//       <MainContent selectedSubject={selectedSubject} />
//     </Box>
//   );
// };

// export default App;
