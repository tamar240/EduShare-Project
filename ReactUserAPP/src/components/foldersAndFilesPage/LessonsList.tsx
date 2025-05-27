
// import { useEffect, useState } from "react";
// import { Lesson, LessonListProps } from "../typies/types";
// // import LessonCard from "./LessonCard"; // ייבוא הקומפוננטה
// import { getCookie } from "../login/Login";
// import axios from "axios";
// import { Button, Grid } from "@mui/material";
// import LessonItem from "./LessonItem";
// import AddLesson from "./AddLesson";
// // import { useNavigate } from "react-router-dom";

// const LessonsGrid = ({ subjectId, type }: LessonListProps) => {
//   const [lessons, setLessons] = useState<Lesson[]>([]);
//   const [addLessonDialogOpen, setAddLessonDialogOpen] = useState<boolean>(false);

//   const baseUrl = import.meta.env.VITE_API_URL;


//   // const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null); // ← חדש
// //   const navigate = useNavigate();

  
// // const handleClick = (lesson: Lesson) => {
// //   navigate("/lessonDisplay", { state: { lesson } });
// // };

//   const fetchLessons = async () => {
//     try {
//       const token = getCookie("auth_token");
//       const response = await axios.get<Lesson[]>(
//         `${baseUrl}/api/Lesson/${type === "PUBLIC" ? "public" : "my"}/${subjectId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setLessons(response.data);
//     } catch (error) {
//       console.error("Failed to fetch lessons", error);
//     }
//   };

//   useEffect(() => {
//     if (subjectId) {
//       fetchLessons();
//     }
//   }, [subjectId, type]);

//   const handleUpdateLesson = (updatedLesson: Lesson) => {
//     setLessons(lessons.map((lesson) => (lesson.id === updatedLesson.id ? updatedLesson : lesson)));
//   };

//   const handleDeleteLesson = async (lessonId: number) => {
//     try {
//       const token = getCookie("auth_token");
//       await axios.delete(`${baseUrl}/api/Lesson/${lessonId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setLessons(lessons.filter((lesson) => lesson.id !== lessonId));
//     } catch (error) {
//       console.error("Failed to delete lesson", error);
//     }
//   };

//   const handlePermissionChange = async (lessonId: number, newPermission: number) => {
//     try {
//       const token = getCookie("auth_token");
//       await axios.put(
//         `${baseUrl}/api/Lesson/permission/${lessonId}`,
//         { permission: newPermission },
//         { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
//       );
//       setLessons(lessons.map((lesson) => (lesson.id === lessonId ? { ...lesson, permission: newPermission } : lesson)));
//     } catch (error) {
//       console.error("Failed to update permission", error);
//     }
//   };

//   // if (selectedLesson) {
//   //   return (
//   //     <div className="p-4">
//   //       <Button
//   //         variant="outlined"
//   //         onClick={() => setSelectedLesson(null)}
//   //         sx={{ mb: 2 }}
//   //       >
//   //         חזרה לרשימת השיעורים
//   //       </Button>
//   //       {/* <LessonCard selectedSubjectLessons={null} subjectId={0} type={"PUBLIC"} /> */}
//   //     </div>
//   //   );
//   // }

//   return (
//     <Grid container spacing={2} sx={{ mt: 2 }}>
//       <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
//         {type === "PERSONAL" && (
//           <Button
//             variant="contained"
//             // startIcon={<AddIcon />}
//             onClick={() => setAddLessonDialogOpen(true)}
//           >
//             הוסף שיעור
//           </Button>
//         )}
//       </Grid>

//       {lessons.map((lesson) => (
//         <Grid item xs={12} sm={6} md={4} lg={3} key={lesson.id}
//         // onClick={() => setSelectedLesson(lesson)} // ← חדש
//         >


//   {/* תוכן כרטיס שיעור */}

//           <LessonItem
//             lesson={lesson}
//             onDelete={handleDeleteLesson}
//             onUpdate={handleUpdateLesson}
//             onPermissionChange={handlePermissionChange}
          
//             type={type}
//           />
//         </Grid>
//       ))}

//       <AddLesson
//         open={addLessonDialogOpen}
//         onClose={() => setAddLessonDialogOpen(false)}
//         subjectId={subjectId}
//         onLessonAdded={fetchLessons}
//       />
//     </Grid>
//   );
// };

// export default LessonsGrid;

"use client"

import { useEffect, useState } from "react"
import type { Lesson, LessonListProps } from "../typies/types"
import { getCookie } from "../login/Login"
import axios from "axios"
import { Button, Grid } from "@mui/material"
import LessonItem from "./LessonItem"
import AddLesson from "./AddLesson"

const LessonsGrid = ({ subjectId, type }: LessonListProps) => {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [addLessonDialogOpen, setAddLessonDialogOpen] = useState<boolean>(false)

  const baseUrl = import.meta.env.VITE_API_URL

  const fetchLessons = async () => {
    try {
      const token = getCookie("auth_token")
      const response = await axios.get<Lesson[]>(
        `${baseUrl}/api/Lesson/${type === "PUBLIC" ? "public" : "my"}/${subjectId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setLessons(response.data)
    } catch (error) {
      console.error("Failed to fetch lessons", error)
    }
  }

  useEffect(() => {
    if (subjectId) {
      fetchLessons()
    }
  }, [subjectId, type])

  const handleUpdateLesson = (updatedLesson: Lesson) => {
    setLessons(lessons.map((lesson) => (lesson.id === updatedLesson.id ? updatedLesson : lesson)))
  }

  const handleDeleteLesson = async (lessonId: number) => {
    try {
      const token = getCookie("auth_token")
      await axios.delete(`${baseUrl}/api/Lesson/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setLessons(lessons.filter((lesson) => lesson.id !== lessonId))
    } catch (error) {
      console.error("Failed to delete lesson", error)
    }
  }

  const handlePermissionChange = async (lessonId: number, newPermission: number) => {
    try {
      const token = getCookie("auth_token")
      await axios.put(
        `${baseUrl}/api/Lesson/permission/${lessonId}`,
        { permission: newPermission },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } },
      )
      setLessons(lessons.map((lesson) => (lesson.id === lessonId ? { ...lesson, permission: newPermission } : lesson)))
    } catch (error) {
      console.error("Failed to update permission", error)
    }
  }

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
        {type === "PERSONAL" && (
          <Button variant="contained" onClick={() => setAddLessonDialogOpen(true)}>
            הוסף שיעור
          </Button>
        )}
      </Grid>

      {lessons.map((lesson) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={lesson.id}>
          <LessonItem
            lesson={lesson}
            onDelete={handleDeleteLesson}
            onUpdate={handleUpdateLesson}
            onPermissionChange={handlePermissionChange}
            type={type}
          />
        </Grid>
      ))}

      <AddLesson
        open={addLessonDialogOpen}
        onClose={() => setAddLessonDialogOpen(false)}
        subjectId={subjectId}
        onLessonAdded={fetchLessons}
      />
    </Grid>
  )
}

export default LessonsGrid
