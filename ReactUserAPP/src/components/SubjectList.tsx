import { List, ListItemButton, ListItemText, IconButton, Collapse, Box, Typography, Divider } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InfoIcon from "@mui/icons-material/Info";
import { Subject } from "./UserFilesPage";

interface SubjectListProps {
  subjects: Subject[];
  loading: boolean;
  error: string | null;
  handleShowLessons: (subjectId: number) => void;
  expandedSubjectDetails: { [key: number]: boolean };
  toggleSubjectDetails: (subjectId: number) => void;
}

const SubjectList = ({ subjects, loading, error, handleShowLessons, expandedSubjectDetails, toggleSubjectDetails }: SubjectListProps) => {
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
                <ListItemText primary={subject.name} />
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
