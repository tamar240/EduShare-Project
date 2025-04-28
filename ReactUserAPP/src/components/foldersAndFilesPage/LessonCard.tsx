// // import { FileText, Lock, Globe, Users } from "lucide-react";
// // import { UploadedFileData } from "../typies/types";

// // type FileAccess = "Private" | "Public" | "Institutional";

// // type LessonProps = {
// //   name: string;
// //   createdAt: string;
// //   permission: FileAccess;
// //   summaryUrl?: string;
// //   summaryType?: "original" | "processed";
// // };

// // export default function LessonCard({
// //   name,
// //   createdAt,
// //   permission,
// //   summaryUrl,
// //   summaryType,
// //   }: LessonProps) {
// //   const renderPermissionIcon = () => {
// //     switch (permission) {
// //       case "Private": return <Lock className="w-5 h-5 text-gray-600" />;
// //       case "Public": return <Globe className="w-5 h-5 text-green-600" />;
// //       case "Institutional": return <Users className="w-5 h-5 text-blue-600" />;
// //     }
// //   };

// //   return (
// //     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-white rounded-2xl shadow-md border">
// //       {/* Summary */}
// //       <div className="md:col-span-2">
// //         <h2 className="text-2xl font-semibold mb-2">{name}</h2>
// //         <p className="text-sm text-gray-500 mb-4">נוצר בתאריך: {new Date(createdAt).toLocaleDateString()}</p>
// //         <div className="rounded-xl border p-4 bg-gray-100 h-72 overflow-auto">
// //           {summaryUrl ? (
// //             <iframe
// //               src={summaryUrl}
// //               title="Lesson Summary"
// //               className="w-full h-full rounded-xl border"
// //             />
// //           ) : (
// //             <p className="text-center text-gray-500 mt-24">לא קיים סיכום לשיעור</p>
// //           )}
// //         </div>
// //         <p className="text-sm text-right text-gray-500 mt-2">
// //           ({summaryType === "processed" ? "סיכום שעבר עיבוד AI" : "סיכום מקורי"})
// //         </p>
// //       </div>

// //       {/* Lesson Info & Files */}
// //       <div className="flex flex-col justify-between h-full">
// //         <div className="mb-6">
// //           <div className="flex items-center gap-2 mb-2">
// //             {renderPermissionIcon()}
// //             <span className="text-sm font-medium text-gray-700">הרשאה: {permission}</span>
// //           </div>
// //           <div className="bg-gray-50 border rounded-lg p-4">
// //             {/* <h4 className="text-lg font-semibold mb-2">קבצים מצורפים</h4>
// //             {files.length > 0 ? (
// //               <ul className="space-y-2 text-sm">
// //                 {files.map((file, index) => (
// //                   <li key={index}>
// //                     <a
// //                       href={file.filePath}
// //                       target="_blank"
// //                       rel="noopener noreferrer"
// //                       className="text-blue-600 hover:underline flex items-center gap-2"
// //                     >
// //                       <FileText className="w-4 h-4" />
// //                       {file.fileName}
// //                     </a>
// //                   </li>
// //                 ))}
// //               </ul>
// //             ) : (
// //               <p className="text-gray-500 text-sm">אין קבצים מצורפים</p>
// //             )} */}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// import { useEffect, useState } from "react";
// import { Lesson, LessonListProps } from "../typies/types";
// import LessonCard from "./LessonCard"; // ייבוא הקומפוננטה
// import { getCookie } from "../login/Login";
// import axios from "axios";
// import { Button, Grid } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import LessonItem from "./LessonItem";
// import AddLesson from "./AddLesson";

// const LessonsGrid = ({ subjectId, type }: LessonListProps) => {
//   const [lessons, setLessons] = useState<Lesson[]>([]);
//   const [addLessonDialogOpen, setAddLessonDialogOpen] = useState<boolean>(false);
//   const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null); // ← חדש

//   const fetchLessons = async () => {
//     try {
//       const token = getCookie("auth_token");
//       const response = await axios.get<Lesson[]>(
//         `https://localhost:7249/api/Lesson/${type === "PUBLIC" ? "public" : "my"}/${subjectId}`,
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
//       await axios.delete(`https://localhost:7249/api/Lesson/${lessonId}`, {
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
//         `https://localhost:7249/api/Lesson/permission/${lessonId}`,
//         { permission: newPermission },
//         { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
//       );
//       setLessons(lessons.map((lesson) => (lesson.id === lessonId ? { ...lesson, permission: newPermission } : lesson)));
//     } catch (error) {
//       console.error("Failed to update permission", error);
//     }
//   };

//   if (selectedLesson) {
//     return (
//       <div className="p-4">
//         <Button
//           variant="outlined"
//           onClick={() => setSelectedLesson(null)}
//           sx={{ mb: 2 }}
//         >
//           חזרה לרשימת השיעורים
//         </Button>
//         <LessonCard selectedSubjectLessons={null} type={"PUBLIC"} {...selectedLesson} />
//       </div>
//     );
//   }

//   return (
//     <Grid container spacing={2} sx={{ mt: 2 }}>
//       <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
//         {type === "PERSONAL" && (
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={() => setAddLessonDialogOpen(true)}
//           >
//             הוסף שיעור
//           </Button>
//         )}
//       </Grid>

//       {lessons.map((lesson) => (
//         <Grid item xs={12} sm={6} md={4} lg={3} key={lesson.id}
//         onClick={() => setSelectedLesson(lesson)} // ← חדש>
//         >
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
