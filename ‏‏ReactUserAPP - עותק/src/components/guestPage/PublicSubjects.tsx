import { useEffect, useState } from "react";
import { List, ListItemButton, ListItemText, IconButton, Collapse, Box, Typography, Divider } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InfoIcon from "@mui/icons-material/Info";
import axios from "axios";

interface PublicSubject {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  ownerName: string; // שם המורה שיצר את המקצוע
}

const PublicSubjectsPage = () => {
  const [subjects, setSubjects] = useState<PublicSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSubjectDetails, setExpandedSubjectDetails] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchPublicSubjects = async () => {
      try {
        const response = await axios.get("https://localhost:7249/api/Subject/public");
        setSubjects(response.data);
      } catch (err) {
        setError("לא ניתן לטעון מקצועות ציבוריים");
      } finally {
        setLoading(false);
      }
    };
    fetchPublicSubjects();
  }, []);

  const toggleSubjectDetails = (subjectId: number) => {
    setExpandedSubjectDetails((prev) => ({ ...prev, [subjectId]: !prev[subjectId] }));
  };

  return (
    <Box sx={{ width: 300, p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center" }}>מקצועות ציבוריים</Typography>
      <Divider sx={{ mb: 2 }} />
      {loading ? (
        <Typography color="text.secondary">טוען...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <List>
          {subjects.map((subject) => (
            <Box key={subject.id}>
              <ListItemButton>
                <FolderIcon sx={{ mr: 1 }} />
                <ListItemText primary={subject.name} />
                <IconButton onClick={() => toggleSubjectDetails(subject.id)}>
                  <InfoIcon />
                </IconButton>
              </ListItemButton>
              <Collapse in={expandedSubjectDetails[subject.id]}>
                <Box sx={{ pl: 4, mb: 1 }}>
                  <Typography variant="body2">מורה: {subject.ownerName}</Typography>
                  <Typography variant="body2">נוצר בתאריך: {new Date(subject.createdAt).toLocaleString()}</Typography>
                  <Typography variant="body2">עודכן לאחרונה: {new Date(subject.updatedAt).toLocaleString()}</Typography>
                </Box>
              </Collapse>
            </Box>
          ))}
        </List>
      )}
    </Box>
  );
};

export default PublicSubjectsPage;
