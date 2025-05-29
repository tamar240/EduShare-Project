// import { useState } from "react";
// import {
//   Dialog, DialogActions, DialogContent, TextField,
//   FormControl, InputLabel, Select, MenuItem, DialogTitle,
//   Button, Typography
// } from "@mui/material";
// import axios from "axios";
// import { getCookie } from "../login/Login";
// import { Lesson, UploadedFileData } from "../typies/types";
// import AWSFileUpload from "../file/AWSFileUpload";

// interface AddLessonDialogProps {
//   open: boolean;
//   onClose: () => void;
//   subjectId: number;
//   onLessonAdded: (lesson: Lesson) => void;
// }

// const AddLesson = ({ open, onClose, subjectId, onLessonAdded }: AddLessonDialogProps) => {
//   const [newLessonName, setNewLessonName] = useState("");
//   const [newLessonPermission, setNewLessonPermission] = useState(0);
//   const [uploadedFile, setUploadedFile] = useState<(UploadedFileData & { viewUrl: string }) | null>(null);

//   const baseUrl = import.meta.env.VITE_API_URL;



//   const handleAddLesson = async () => {
//     if (!uploadedFile) return;

//     try {
//       console.log("uploadedFile", uploadedFile);
      
//       const token = getCookie("auth_token");
//       const response = await axios.post(
//       `${baseUrl}/api/Lesson`,
//         {
//           lessonDTO: {
//             name: newLessonName,
//             subjectId,
//             permission: newLessonPermission,
//           },
//           fileId: uploadedFile.id,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       onLessonAdded(response.data);
//       resetForm();
//     } catch (error) {
//       console.error("❌ שגיאה בהוספת שיעור:", error);
//       alert("אירעה שגיאה בעת הוספת שיעור.");
//     }
//   };

//   const resetForm = () => {
//     setNewLessonName("");
//     setNewLessonPermission(0);
//     setUploadedFile(null);
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>הוסף שיעור חדש</DialogTitle>
//       <DialogContent>
//         <TextField
//           fullWidth
//           margin="dense"
//           label="שם השיעור"
//           value={newLessonName}
//           onChange={(e) => setNewLessonName(e.target.value)}
//         />

//         <FormControl fullWidth margin="dense">
//           <InputLabel>הרשאה</InputLabel>
//           <Select
//             value={newLessonPermission}
//             onChange={(e) => setNewLessonPermission(Number(e.target.value))}
//           >
//             <MenuItem value={0}>פרטי</MenuItem>
//             <MenuItem value={1}>ציבורי</MenuItem>
//           </Select>
//         </FormControl>

//         <Typography variant="subtitle1" sx={{ mt: 2 }}>
//           העלאת קובץ סיכום:
//         </Typography>

//         <AWSFileUpload
//           lessonId="0" // לא חייב רלוונטי כרגע
//           onUploadComplete={(file) => setUploadedFile(file)}
//         />

//         {uploadedFile && (
//           <Typography variant="body2" color="green" sx={{ mt: 1 }}>
//             ✅ הקובץ הועלה בהצלחה!
//           </Typography>
//         )}
//       </DialogContent>

//       <DialogActions>
//         <Button onClick={onClose}>ביטול</Button>
//         <Button
//           onClick={handleAddLesson}
//           color="secondary"
//           disabled={!newLessonName || !uploadedFile}
//         >
//           הוסף
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddLesson;
import { useState } from "react";
import {
  Dialog, DialogActions, DialogContent, TextField,
  FormControl, InputLabel, Select, MenuItem, DialogTitle,
  Button, Typography, LinearProgress, Box
} from "@mui/material";
import axios from "axios";
import { getCookie } from "../login/Login";
import { Lesson, UploadedFileData } from "../typies/types";
import AWSFileUpload from "../file/AWSFileUpload";

interface AddLessonDialogProps {
  open: boolean;
  onClose: () => void;
  subjectId: number;
  onLessonAdded: (lesson: Lesson) => void;
}

const AddLesson = ({ open, onClose, subjectId, onLessonAdded }: AddLessonDialogProps) => {
  const [newLessonName, setNewLessonName] = useState("");
  const [newLessonPermission, setNewLessonPermission] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<(UploadedFileData & { viewUrl: string }) | null>(null);
  const [isLoading, setIsLoading] = useState(false); // 🟢 חדש

  const baseUrl = import.meta.env.VITE_API_URL;

  const handleAddLesson = async () => {
    if (!uploadedFile) return;

    try {
      setIsLoading(true); // הצג את פופאפ הטעינה

      const token = getCookie("auth_token");
      const response = await axios.post(
        `${baseUrl}/api/Lesson`,
        {
          lessonDTO: {
            name: newLessonName,
            subjectId,
            permission: newLessonPermission,
          },
          fileId: uploadedFile.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      onLessonAdded(response.data);
      resetForm();
    } catch (error) {
      console.error("❌ שגיאה בהוספת שיעור:", error);
      alert("אירעה שגיאה בעת הוספת שיעור.");
    } finally {
      setIsLoading(false); // סיים את הטעינה
    }
  };

  const resetForm = () => {
    setNewLessonName("");
    setNewLessonPermission(0);
    setUploadedFile(null);
    onClose();
  };

  return (
    <>
      {/* 🔵 דיאלוג הוספת שיעור */}
      <Dialog open={open} onClose={onClose}>
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
            <Select
              value={newLessonPermission}
              onChange={(e) => setNewLessonPermission(Number(e.target.value))}
            >
              <MenuItem value={0}>פרטי</MenuItem>
              <MenuItem value={1}>ציבורי</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            העלאת קובץ סיכום:
          </Typography>

          <AWSFileUpload
            lessonId="0"
            onUploadComplete={(file) => setUploadedFile(file)}
          />

          {uploadedFile && (
            <Typography variant="body2" color="green" sx={{ mt: 1 }}>
              ✅ הקובץ הועלה בהצלחה!
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>ביטול</Button>
          <Button
            onClick={handleAddLesson}
            color="secondary"
            disabled={!newLessonName || !uploadedFile}
          >
            הוסף
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🔴 פופאפ טעינה */}
      <Dialog open={isLoading}>
        <DialogContent sx={{ textAlign: "center", p: 4 }}>
          <Typography variant="h6" gutterBottom>
            הקובץ מעובד...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            כמה רגעים ואנחנו ממשיכים
          </Typography>
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddLesson;
