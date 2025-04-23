
import { useState } from "react";
import {
  Dialog, DialogActions, DialogContent, TextField,
  FormControl, InputLabel, Select, MenuItem, DialogTitle, Button, Typography
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
  const [newLessonName, setNewLessonName] = useState<string>("");
  const [newLessonPermission, setNewLessonPermission] = useState<number>(0);
  const [uploadedFile, setUploadedFile] = useState<(UploadedFileData & { viewUrl: string }) | null>(null);

  const handleAddLesson = async () => {
    try {
      const token = getCookie("auth_token");
  
      // יצירת lessonDTO
      const lessonDTO = {
        name: newLessonName,
        subjectId: subjectId,
        permission: newLessonPermission,
      };
  
      // יצירת fileDTO אם קובץ הועלה
      let fileDTO = null;
      if (uploadedFile) {
        fileDTO = {
          fileName: uploadedFile.fileName,
          fileType: uploadedFile.fileType,
          filePath: uploadedFile.viewUrl, // path מקובץ ה-AWS
          size: uploadedFile.size,
          lessonId: 0, // או lessonId אחר אם יש
        };
      }
  
      // שליחת הבקשה
      const response = await axios.post(
        "https://localhost:7249/api/Lesson",
        { lessonDTO, fileDTO }, // שליחה כ-lessonDTO ו-fileDTO
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      const createdLesson = response.data;
      onLessonAdded(createdLesson);
  
      // אפס הכל אחרי יצירה
      setNewLessonName("");
      setNewLessonPermission(0);
      setUploadedFile(null);
      onClose();
    } catch (error) {
      console.error("❌ שגיאה בהוספת שיעור:", error);
      alert("אירעה שגיאה בעת הוספת שיעור.");
    }
  };
  

  return (
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

        {/* העלאת הקובץ */}
        <AWSFileUpload
          lessonId={"3103"}  // במידת הצורך, תעדכן את ה-lessonId הזה
          onUploadComplete={(file) => setUploadedFile(file)}
        />

        {uploadedFile && (
          <Typography variant="body2" color="green" sx={{ mt: 1 }}>
            ✅ הקובץ הועלה בהצלחה!
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">ביטול</Button>
        <Button
          onClick={handleAddLesson}
          color="secondary"
          disabled={!newLessonName || !uploadedFile} // disable until file is uploaded
        >
          הוסף
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddLesson;
