// import { useState, useEffect } from "react";
// import { List, ListItemButton, ListItemText, Collapse, CircularProgress, Box } from "@mui/material";
// import { ExpandLess, ExpandMore, School } from "@mui/icons-material";

// interface Lesson {
//   id: number;
//   name: string;
// }

// interface Subject {
//   id: number;
//   name: string;
//   lessons: Lesson[];
// }

// const PublicSubjects = () => {
//   const [subjects, setSubjects] = useState<Subject[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [openSubjects, setOpenSubjects] = useState<{ [key: number]: boolean }>({});

//   useEffect(() => {
//     fetch("/api/public/subjects")
//       .then((res) => res.json())
//       .then((data: Subject[]) => {
//         // סינון רק מקצועות עם שיעורים
//         const filteredSubjects = data.filter(subject => subject.lessons.length > 0);
//         setSubjects(filteredSubjects);
//       })
//       .catch((error) => console.error("Error fetching subjects:", error))
//       .finally(() => setLoading(false));
//   }, []);

//   const toggleLessons = (subjectId: number) => {
//     setOpenSubjects((prev) => ({ ...prev, [subjectId]: !prev[subjectId] }));
//   };

//   if (loading) return <CircularProgress />;

//   return (
//     <Box sx={{ maxWidth: 500, margin: "auto", mt: 4 }}>
//       <List>
//         {subjects.length === 0 ? (
//           <ListItemText primary="אין מקצועות ציבוריים עם שיעורים זמינים." />
//         ) : (
//           subjects.map((subject) => (
//             <Box key={subject.id}>
//               <ListItemButton onClick={() => toggleLessons(subject.id)}>
//                 <School sx={{ mr: 1 }} />
//                 <ListItemText primary={subject.name} />
//                 {openSubjects[subject.id] ? <ExpandLess /> : <ExpandMore />}
//               </ListItemButton>
//               <Collapse in={openSubjects[subject.id]} timeout="auto" unmountOnExit>
//                 <List component="div" disablePadding>
//                   {subject.lessons.map((lesson) => (
//                     <ListItemButton key={lesson.id} sx={{ pl: 4 }}>
//                       <ListItemText primary={lesson.name} />
//                     </ListItemButton>
//                   ))}
//                 </List>
//               </Collapse>
//             </Box>
//           ))
//         )}
//       </List>
//     </Box>
//   );
// };

// export default PublicSubjects;
