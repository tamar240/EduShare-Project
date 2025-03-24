import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "./Login";
import { Box, Drawer, Menu, MenuItem } from "@mui/material";
import SubjectList from "./SubjectList";
import LessonList from "./LessonList";

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
  permission: string;
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
        const response = await axios.get<Subject[]>("https://localhost:7249/api/Subject/user", {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
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
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#E3F2FD" }}>
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
        <LessonList selectedSubjectLessons={selectedSubjectLessons} handleMenuOpen={handleMenuOpen} />
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