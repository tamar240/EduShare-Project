// import { Box, TextField, Button, Divider, CircularProgress, Typography } from "@mui/material";
// import { Lesson } from "./UserFilesPage";

// interface LessonDetailsProps {
//   lesson: Lesson | null;
//   editLesson: Lesson | null;
//   setEditLesson: (lesson: Lesson | null) => void;
//   handleSubmitEdit: () => void;
//   handleCancelEdit: () => void;
//   loadingUpdate: boolean;
// }

// const LessonDetails = ({ lesson, editLesson, setEditLesson, handleSubmitEdit, handleCancelEdit, loadingUpdate }: LessonDetailsProps) => {
//   if (!editLesson) return null;

//   return (
//     <Box sx={{ width: 400, p: 3 }}>
//       <Typography variant="h6">עריכת שיעור</Typography>
//       <Divider sx={{ my: 2 }} />
//       <Box component="form">
//         <TextField
//           label="שם השיעור"
//           variant="outlined"
//           fullWidth
//           value={editLesson.name}
//           onChange={(e) => setEditLesson({ ...editLesson, name: e.target.value })}
//           sx={{ mb: 2 }}
//         />
//         <TextField
//           label="ID מקצוע"
//           variant="outlined"
//           fullWidth
//           value={editLesson.subjectId}
//           onChange={(e) => setEditLesson({ ...editLesson, subjectId: parseInt(e.target.value) })}
//           sx={{ mb: 2 }}
//         />
//         <TextField
//           label="ID בעלים"
//           variant="outlined"
//           fullWidth
//           value={editLesson.ownerId}
//           onChange={(e) => setEditLesson({ ...editLesson, ownerId: parseInt(e.target.value) })}
//           sx={{ mb: 2 }}
//         />
//         <TextField
//           label="הרשאה"
//           variant="outlined"
//           fullWidth
//           value={editLesson.permission}
//           onChange={(e) => setEditLesson({ ...editLesson, permission: e.target.value })}
//           sx={{ mb: 2 }}
//         />
//         <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//           <Button onClick={handleCancelEdit}>ביטול</Button>
//           <Button onClick={handleSubmitEdit} disabled={loadingUpdate}>
//             {loadingUpdate ? <CircularProgress size={24} /> : "שמור"}
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default LessonDetails;