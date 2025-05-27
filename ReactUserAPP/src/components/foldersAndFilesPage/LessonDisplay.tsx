// "use client"

// import type React from "react"
// import { useEffect, useState } from "react"
// import axios from "axios"
// import {
//   Box,
//   Card,
//   CardContent,
//   CircularProgress,
//   Grid,
//   Typography,
//   Button,
//   ThemeProvider,
//   createTheme,
//   Paper,
//   Divider,
//   Skeleton,
//   Chip,
// } from "@mui/material"
// import { useLocation, useNavigate } from "react-router-dom"
// import type { Lesson, UploadedFileData } from "../typies/types"
// import { getCookie } from "../login/Login"
// import OpenInNewIcon from "@mui/icons-material/OpenInNew"
// import DownloadIcon from "@mui/icons-material/Download"
// import DescriptionIcon from "@mui/icons-material/Description"
// import ImageIcon from "@mui/icons-material/Image"
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
// import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"
// import PreviewIcon from "@mui/icons-material/Preview"
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward"

// // Create RTL theme with custom colors
// const theme = createTheme({
//   direction: "rtl",
//   palette: {
//     primary: {
//       main: "#1976d2",
//     },
//     secondary: {
//       main: "#f50057",
//     },
//     background: {
//       default: "#f5f7fa",
//       paper: "#ffffff",
//     },
//   },
//   typography: {
//     fontFamily: '"Heebo", "Roboto", "Arial", sans-serif',
//     h4: {
//       fontWeight: 700,
//     },
//     h6: {
//       fontWeight: 600,
//     },
//   },
//   components: {
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: 12,
//           boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
//           transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
//           "&:hover": {
//             boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
//           },
//         },
//       },
//     },
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 8,
//           textTransform: "none",
//           fontWeight: 500,
//         },
//       },
//     },
//   },
// })

// const LessonDisplay: React.FC = () => {
//   const location = useLocation()
//   const navigate = useNavigate()
//   const token = getCookie("auth_token")
//   const baseUrl = import.meta.env.VITE_API_URL;


//   const lesson = location?.state?.lesson as Lesson | undefined
//   const subjectId = location?.state?.subjectId as number | undefined

//   const [lessonFiles, setLessonFiles] = useState<UploadedFileData[]>([])
//   const [originalSummary, setOriginalSummary] = useState<UploadedFileData>()
//   const [processedSummary, setProcessedSummary] = useState<UploadedFileData>()
//   const [originalUrl, setOriginalUrl] = useState<string>("")
//   const [processedUrl, setProcessedUrl] = useState<string>("")
//   const [filePreviews, setFilePreviews] = useState<{ [key: string]: string }>({})
//   const [loading, setLoading] = useState<boolean>(true)

//   useEffect(() => {
//     if (!lesson) navigate("/lessons")
//   }, [lesson, navigate])

//   const getPresignedUrl = async (filePath: string): Promise<string | null> => {
//     try {
//       const res = await axios.get(`${baseUrl}/api/upload/presigned-url/view`, {
//         params: { filePath },
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       return res.data.url
//     } catch (err) {
//       console.error("Error getting presigned URL:", err)
//       return null
//     }
//   }

//   const fetchLessonFiles = async () => {
//     try {
//       const res = await axios.get(`${baseUrl}/api/UploadedFile/lesson/${lesson?.id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       setLessonFiles(res.data)
//     } catch (err) {
//       console.error("Error fetching lesson files:", err)
//     }
//   }

//   const fetchSummaries = async () => {
//     try {
//       let original, processed

//       if (lesson?.orginalSummaryId) {
//         const res = await axios.get(`${baseUrl}/api/UploadedFile/id/${lesson.orginalSummaryId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         original = res.data
//         setOriginalSummary(original)
//         const url = await getPresignedUrl(original.s3Key)
//         if (url) setOriginalUrl(url)
//       }

//       if (lesson?.processedSummaryId) {
//         const res = await axios.get(`${baseUrl}/api/UploadedFile/id/${lesson.processedSummaryId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         processed = res.data
//         setProcessedSummary(processed)
//         const url = await getPresignedUrl(processed.filePath)
//         if (url) setProcessedUrl(url)
//       }
//     } catch (err) {
//       console.error("Error fetching summaries:", err)
//     }
//   }

//   const fetchAll = async () => {
//     setLoading(true)
//     await Promise.all([fetchLessonFiles(), fetchSummaries()])
//     setLoading(false)
//   }

//   useEffect(() => {
//     if (lesson) fetchAll()
//   }, [lesson])

//   useEffect(() => {
//     const fetchPreviewUrls = async () => {
//       const previews: { [key: string]: string } = {}
//       for (const file of lessonFiles) {
//         if (file.s3Key) {
//           const url = await getPresignedUrl(file.s3Key)
//           if (url) previews[file.s3Key] = url
//         }
//       }
//       setFilePreviews(previews)
//     }

//     if (lessonFiles.length > 0) fetchPreviewUrls()
//   }, [lessonFiles])

//   const isImageFile = (fileName: string) =>
//     [".jpg", ".jpeg", ".png", ".gif", ".bmp"].some((ext) => fileName.toLowerCase().endsWith(ext))

//   const isPdfFile = (fileName: string) => fileName.toLowerCase().endsWith(".pdf")

//   const getFileIcon = (fileName: string) => {
//     if (isImageFile(fileName)) return <ImageIcon sx={{ fontSize: 60, color: "primary.main", opacity: 0.8 }} />
//     if (isPdfFile(fileName)) return <PictureAsPdfIcon sx={{ fontSize: 60, color: "#e53935", opacity: 0.8 }} />
//     if (fileName.toLowerCase().endsWith(".doc") || fileName.toLowerCase().endsWith(".docx"))
//       return <DescriptionIcon sx={{ fontSize: 60, color: "#2a5699", opacity: 0.8 }} />
//     return <InsertDriveFileIcon sx={{ fontSize: 60, color: "text.secondary", opacity: 0.8 }} />
//   }

//   const getFileTypeLabel = (fileName: string) => {
//     const extension = fileName.split(".").pop()?.toUpperCase() || ""
//     return extension
//   }

//   const isWordFile = (fileName: string) =>
//     fileName.toLowerCase().endsWith(".doc") || fileName.toLowerCase().endsWith(".docx")

//   // Function to handle the back button click
//   const handleGoBack = () => {
//     // If we have subjectId and type, we can return to the subject's lessons list
//     if (subjectId && lesson) {
//       // Navigate back to the parent component, but pass the necessary state to show lessons
//       navigate("/lessons", {
//         state: {
//           showLessons: true,
//           subjectId: lesson.subjectId,
//           selectedSubject: { id: lesson.subjectId },
//         },
//       })
//     } else {
//       // Otherwise just go back
//       navigate(-1)
//     }
//   }

//   // Function to handle Word file preview (using Google Docs Viewer)
//   const handlePreviewWordFile = (url: string) => {
//     // Using Google Docs Viewer to preview the file
//     const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
//     window.open(googleDocsViewerUrl, "_blank")
//   }

//   if (!lesson) return null

//   return (
//     <ThemeProvider theme={theme}>
//       <Box
//         sx={{
//           bgcolor: "background.default",
//           minHeight: "100vh",
//           py: 4,
//           px: { xs: 2, sm: 4, md: 6 },
//         }}
//       >
//         {/* Back Button */}
//         <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
//           <Button variant="outlined" startIcon={<ArrowForwardIcon />} onClick={handleGoBack} sx={{ borderRadius: 2 }}>
//             חזרה לרשימת השיעורים
//           </Button>
//         </Box>

//         <Paper
//           elevation={0}
//           sx={{
//             p: { xs: 2, sm: 3, md: 4 },
//             borderRadius: 3,
//             mb: 4,
//             background: "linear-gradient(135deg, #f5f7ff 0%, #ffffff 100%)",
//             border: "1px solid rgba(0,0,0,0.05)",
//           }}
//         >
//           <Typography
//             variant="h4"
//             align="right"
//             sx={{
//               color: "primary.main",
//               mb: 1,
//               fontSize: { xs: "1.5rem", sm: "2rem" },
//             }}
//           >
//             {lesson.name}
//           </Typography>
//           <Divider sx={{ my: 2 }} />

//           <Grid container spacing={4} direction="row-reverse">
//             {/* סיכום מעובד */}
//             <Grid item xs={12} md={8}>
//               <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
//                 <CardContent sx={{ p: 0, flexGrow: 1, display: "flex", flexDirection: "column" }}>
//                   <Box sx={{ p: 3, pb: 2 }}>
//                     <Typography
//                       variant="h6"
//                       align="right"
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "flex-end",
//                         gap: 1,
//                       }}
//                     >
//                       <DescriptionIcon color="primary" />
//                       סיכום מעובד
//                     </Typography>
//                   </Box>

//                   <Box sx={{ flexGrow: 1, px: 3, pb: 3 }}>
//                     {loading ? (
//                       <Skeleton variant="rectangular" height={180} animation="wave" />
//                     ) : processedUrl ? (
//                       <Box
//                         sx={{
//                           border: "1px solid rgba(0,0,0,0.08)",
//                           borderRadius: 2,
//                           overflow: "hidden",
//                           height: "180px",
//                           display: "flex",
//                           justifyContent: "center",
//                           alignItems: "center",
//                           boxShadow: "inset 0 0 10px rgba(0,0,0,0.03)",
//                           bgcolor: "rgba(0,0,0,0.02)",
//                         }}
//                       >
//                         {isPdfFile(processedSummary?.fileName || "") ? (
//                           <Box
//                             sx={{
//                               width: "100%",
//                               height: "100%",
//                               display: "flex",
//                               flexDirection: "column",
//                               justifyContent: "center",
//                               alignItems: "center",
//                               position: "relative",
//                             }}
//                           >
//                             <PictureAsPdfIcon sx={{ fontSize: 60, color: "#e53935", mb: 1 }} />
//                             <Typography
//                               variant="body2"
//                               sx={{
//                                 color: "#e53935",
//                                 fontWeight: "medium",
//                                 textAlign: "center",
//                                 px: 2,
//                               }}
//                             >
//                               {processedSummary?.fileName}
//                             </Typography>
//                             <Typography color="text.secondary" variant="caption" sx={{ mt: 1 }}>
//                               מסמך PDF
//                             </Typography>
//                           </Box>
//                         ) : isWordFile(processedSummary?.fileName || "") ? (
//                           <Box
//                             sx={{
//                               width: "100%",
//                               height: "100%",
//                               display: "flex",
//                               flexDirection: "column",
//                               justifyContent: "center",
//                               alignItems: "center",
//                               borderRadius: 2,
//                               bgcolor: "rgba(240, 247, 255, 0.5)",
//                               border: "1px solid rgba(42, 86, 153, 0.2)",
//                               position: "relative",
//                               overflow: "hidden",
//                             }}
//                           >
//                             <Box
//                               sx={{
//                                 position: "absolute",
//                                 top: 0,
//                                 left: 0,
//                                 right: 0,
//                                 height: "8px",
//                                 bgcolor: "#2a5699",
//                               }}
//                             />
//                             <DescriptionIcon sx={{ fontSize: 60, color: "#2a5699", mb: 1 }} />
//                             <Typography
//                               variant="body2"
//                               sx={{
//                                 color: "#2a5699",
//                                 fontWeight: "medium",
//                                 textAlign: "center",
//                                 px: 2,
//                               }}
//                             >
//                               {processedSummary?.fileName}
//                             </Typography>
//                             <Typography color="text.secondary" variant="caption" sx={{ mt: 1 }}>
//                               מסמך Word
//                             </Typography>
//                           </Box>
//                         ) : (
//                           <Box
//                             sx={{
//                               width: "100%",
//                               height: "100%",
//                               display: "flex",
//                               flexDirection: "column",
//                               justifyContent: "center",
//                               alignItems: "center",
//                             }}
//                           >
//                             <DescriptionIcon sx={{ fontSize: 60, color: "primary.main", mb: 1 }} />
//                             <Typography
//                               variant="body2"
//                               sx={{
//                                 color: "primary.main",
//                                 fontWeight: "medium",
//                                 textAlign: "center",
//                                 px: 2,
//                               }}
//                             >
//                               {processedSummary?.fileName}
//                             </Typography>
//                             <Typography color="text.secondary" variant="caption" sx={{ mt: 1 }}>
//                               מסמך
//                             </Typography>
//                           </Box>
//                         )}
//                       </Box>
//                     ) : (
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "center",
//                           alignItems: "center",
//                           height: "180px",
//                           bgcolor: "rgba(0,0,0,0.02)",
//                           borderRadius: 2,
//                         }}
//                       >
//                         <Typography align="center" color="text.secondary">
//                           אין סיכום מעובד.
//                         </Typography>
//                       </Box>
//                     )}
//                   </Box>

//                   {processedSummary?.filePath && (
//                     <Box
//                       sx={{
//                         display: "flex",
//                         justifyContent: "flex-end",
//                         gap: 1,
//                         p: 2,
//                         borderTop: "1px solid rgba(0,0,0,0.08)",
//                         bgcolor: "rgba(0,0,0,0.01)",
//                       }}
//                     >
//                       <Button
//                         variant="outlined"
//                         startIcon={<OpenInNewIcon />}
//                         href={processedUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         size="small"
//                         sx={{ borderRadius: 2 }}
//                       >
//                         פתח בחלון חדש
//                       </Button>
//                       <Button
//                         variant="contained"
//                         startIcon={<DownloadIcon />}
//                         href={`${baseUrl}/api/upload/download?filePath=${processedSummary.s3Key}&fileName=${processedSummary.fileName}`}
//                         size="small"
//                         sx={{ borderRadius: 2 }}
//                       >
//                         הורד
//                       </Button>
//                     </Box>
//                   )}
//                 </CardContent>
//               </Card>
//             </Grid>

//             {/* סיכום מקורי */}
//             <Grid item xs={12} md={4}>
//               <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
//                 <CardContent sx={{ p: 0, flexGrow: 1, display: "flex", flexDirection: "column" }}>
//                   <Box sx={{ p: 3, pb: 2 }}>
//                     <Typography
//                       variant="h6"
//                       align="right"
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "flex-end",
//                         gap: 1,
//                       }}
//                     >
//                       <DescriptionIcon color="primary" />
//                       סיכום מקורי
//                     </Typography>
//                   </Box>

//                   <Box sx={{ flexGrow: 1, px: 3, pb: 3 }}>
//                     {loading ? (
//                       <Skeleton variant="rectangular" height={180} animation="wave" />
//                     ) : originalUrl ? (
//                       <Box
//                         sx={{
//                           border: "1px solid rgba(0,0,0,0.08)",
//                           borderRadius: 2,
//                           overflow: "hidden",
//                           height: "180px",
//                           display: "flex",
//                           justifyContent: "center",
//                           alignItems: "center",
//                           boxShadow: "inset 0 0 10px rgba(0,0,0,0.03)",
//                           bgcolor: "rgba(0,0,0,0.02)",
//                         }}
//                       >
//                         {isPdfFile(originalSummary?.fileName || "") ? (
//                           <Box
//                             sx={{
//                               width: "100%",
//                               height: "100%",
//                               display: "flex",
//                               flexDirection: "column",
//                               justifyContent: "center",
//                               alignItems: "center",
//                               position: "relative",
//                             }}
//                           >
//                             <PictureAsPdfIcon sx={{ fontSize: 60, color: "#e53935", mb: 1 }} />
//                             <Typography
//                               variant="body2"
//                               sx={{
//                                 color: "#e53935",
//                                 fontWeight: "medium",
//                                 textAlign: "center",
//                                 px: 2,
//                               }}
//                             >
//                               {originalSummary?.fileName}
//                             </Typography>
//                             <Typography color="text.secondary" variant="caption" sx={{ mt: 1 }}>
//                               מסמך PDF
//                             </Typography>
//                           </Box>
//                         ) : isWordFile(originalSummary?.fileName || "") ? (
//                           <Box
//                             sx={{
//                               width: "100%",
//                               height: "100%",
//                               display: "flex",
//                               flexDirection: "column",
//                               justifyContent: "center",
//                               alignItems: "center",
//                               borderRadius: 2,
//                               bgcolor: "rgba(240, 247, 255, 0.5)",
//                               border: "1px solid rgba(42, 86, 153, 0.2)",
//                               position: "relative",
//                               overflow: "hidden",
//                             }}
//                           >
//                             <Box
//                               sx={{
//                                 position: "absolute",
//                                 top: 0,
//                                 left: 0,
//                                 right: 0,
//                                 height: "8px",
//                                 bgcolor: "#2a5699",
//                               }}
//                             />
//                             <DescriptionIcon sx={{ fontSize: 60, color: "#2a5699", mb: 1 }} />
//                             <Typography
//                               variant="body2"
//                               sx={{
//                                 color: "#2a5699",
//                                 fontWeight: "medium",
//                                 textAlign: "center",
//                                 px: 2,
//                               }}
//                             >
//                               {originalSummary?.fileName}
//                             </Typography>
//                             <Typography color="text.secondary" variant="caption" sx={{ mt: 1 }}>
//                               מסמך Word
//                             </Typography>
//                           </Box>
//                         ) : (
//                           <Box
//                             sx={{
//                               width: "100%",
//                               height: "100%",
//                               display: "flex",
//                               flexDirection: "column",
//                               justifyContent: "center",
//                               alignItems: "center",
//                             }}
//                           >
//                             <DescriptionIcon sx={{ fontSize: 60, color: "primary.main", mb: 1 }} />
//                             <Typography
//                               variant="body2"
//                               sx={{
//                                 color: "primary.main",
//                                 fontWeight: "medium",
//                                 textAlign: "center",
//                                 px: 2,
//                               }}
//                             >
//                               {originalSummary?.fileName}
//                             </Typography>
//                             <Typography color="text.secondary" variant="caption" sx={{ mt: 1 }}>
//                               מסמך
//                             </Typography>
//                           </Box>
//                         )}
//                       </Box>
//                     ) : (
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "center",
//                           alignItems: "center",
//                           height: "180px",
//                           bgcolor: "rgba(0,0,0,0.02)",
//                           borderRadius: 2,
//                         }}
//                       >
//                         <Typography align="center" color="text.secondary">
//                           אין סיכום מקורי.
//                         </Typography>
//                       </Box>
//                     )}
//                   </Box>

//                   {originalSummary?.filePath && (
//                     <Box
//                       sx={{
//                         display: "flex",
//                         justifyContent: "flex-end",
//                         gap: 1,
//                         p: 2,
//                         borderTop: "1px solid rgba(0,0,0,0.08)",
//                         bgcolor: "rgba(0,0,0,0.01)",
//                       }}
//                     >
//                       <Button
//                         variant="outlined"
//                         startIcon={<OpenInNewIcon />}
//                         href={originalUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         size="small"
//                         sx={{ borderRadius: 2 }}
//                       >
//                         פתח בחלון חדש
//                       </Button>
//                       <Button
//                         variant="contained"
//                         startIcon={<DownloadIcon />}
//                         href={`${baseUrl}/api/upload/download?filePath=${originalSummary.filePath}&fileName=${originalSummary.fileName}`}
//                         size="small"
//                         sx={{ borderRadius: 2 }}
//                       >
//                         הורד
//                       </Button>
//                     </Box>
//                   )}
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* חומרי עזר */}
//         <Paper
//           elevation={0}
//           sx={{
//             p: { xs: 2, sm: 3, md: 4 },
//             borderRadius: 3,
//             background: "#ffffff",
//             border: "1px solid rgba(0,0,0,0.05)",
//           }}
//         >
//           <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1, mb: 3 }}>
//             <Typography variant="h6" align="right" sx={{ color: "primary.main" }}>
//               חומרי עזר נוספים
//             </Typography>
//           </Box>

//           {loading ? (
//             <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
//               <CircularProgress />
//             </Box>
//           ) : lessonFiles.length === 0 ? (
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 height: "100px",
//                 bgcolor: "rgba(0,0,0,0.02)",
//                 borderRadius: 2,
//                 my: 2,
//               }}
//             >
//               <Typography align="center" color="text.secondary">
//                 אין קבצים נוספים.
//               </Typography>
//             </Box>
//           ) : (
//             <Grid container spacing={3} direction="row-reverse">
//               {lessonFiles.map((file) => {
//                 const previewUrl = filePreviews[file.s3Key] || ""
//                 const fileType = getFileTypeLabel(file.fileName)
//                 const isWord = isWordFile(file.fileName)

//                 return (
//                   <Grid item xs={12} sm={6} md={4} lg={3} key={file.id}>
//                     <Card
//                       sx={{
//                         height: "100%",
//                         display: "flex",
//                         flexDirection: "column",
//                         transition: "all 0.2s ease-in-out",
//                         "&:hover": {
//                           transform: "translateY(-4px)",
//                         },
//                       }}
//                     >
//                       <CardContent
//                         sx={{
//                           p: 0,
//                           flexGrow: 1,
//                           display: "flex",
//                           flexDirection: "column",
//                         }}
//                       >
//                         <Box
//                           sx={{
//                             p: 2,
//                             display: "flex",
//                             justifyContent: "space-between",
//                             alignItems: "flex-start",
//                           }}
//                         >
//                           <Chip
//                             label={fileType}
//                             size="small"
//                             color={isWord ? "info" : "primary"}
//                             variant="outlined"
//                             sx={{
//                               height: 22,
//                               fontSize: "0.7rem",
//                               fontWeight: "bold",
//                             }}
//                           />
//                           <Typography
//                             variant="subtitle1"
//                             fontWeight="medium"
//                             align="right"
//                             sx={{
//                               mb: 1,
//                               fontSize: "0.95rem",
//                               maxWidth: "75%",
//                               overflow: "hidden",
//                               textOverflow: "ellipsis",
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             {file.fileName}
//                           </Typography>
//                         </Box>

//                         <Box
//                           sx={{
//                             display: "flex",
//                             justifyContent: "center",
//                             alignItems: "center",
//                             flexGrow: 1,
//                             p: 2,
//                             pt: 0,
//                           }}
//                         >
//                           {isImageFile(file.fileName) && previewUrl ? (
//                             <Box
//                               sx={{
//                                 width: "100%",
//                                 height: 180,
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 alignItems: "center",
//                                 borderRadius: 2,
//                                 overflow: "hidden",
//                                 bgcolor: "rgba(0,0,0,0.02)",
//                                 border: "1px solid rgba(0,0,0,0.08)",
//                               }}
//                             >
//                               <img
//                                 src={previewUrl || "/placeholder.svg"}
//                                 alt={file.fileName}
//                                 style={{
//                                   maxWidth: "100%",
//                                   maxHeight: "100%",
//                                   objectFit: "contain",
//                                 }}
//                               />
//                             </Box>
//                           ) : isWord ? (
//                             <Box
//                               sx={{
//                                 width: "100%",
//                                 height: 180,
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 justifyContent: "center",
//                                 alignItems: "center",
//                                 borderRadius: 2,
//                                 bgcolor: "rgba(240, 247, 255, 0.5)",
//                                 border: "1px solid rgba(42, 86, 153, 0.2)",
//                                 position: "relative",
//                                 overflow: "hidden",
//                               }}
//                             >
//                               <Box
//                                 sx={{
//                                   position: "absolute",
//                                   top: 0,
//                                   left: 0,
//                                   right: 0,
//                                   height: "8px",
//                                   bgcolor: "#2a5699",
//                                 }}
//                               />
//                               <DescriptionIcon sx={{ fontSize: 60, color: "#2a5699", mb: 1 }} />
//                               <Typography
//                                 variant="body2"
//                                 sx={{
//                                   color: "#2a5699",
//                                   fontWeight: "medium",
//                                   textAlign: "center",
//                                   px: 2,
//                                 }}
//                               >
//                                 {file.fileName}
//                               </Typography>
//                               <Typography color="text.secondary" variant="caption" sx={{ mt: 1 }}>
//                                 מסמך Word
//                               </Typography>
//                             </Box>
//                           ) : (
//                             <Box
//                               sx={{
//                                 width: "100%",
//                                 height: 180,
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 justifyContent: "center",
//                                 alignItems: "center",
//                                 borderRadius: 2,
//                                 bgcolor: "rgba(0,0,0,0.02)",
//                                 border: "1px solid rgba(0,0,0,0.08)",
//                               }}
//                             >
//                               {getFileIcon(file.fileName)}
//                               <Typography color="text.secondary" variant="caption" sx={{ mt: 1 }}>
//                                 תצוגה מקדימה לא זמינה
//                               </Typography>
//                             </Box>
//                           )}
//                         </Box>

//                         <Box
//                           sx={{
//                             display: "flex",
//                             justifyContent: "center",
//                             gap: 1,
//                             p: 2,
//                             borderTop: "1px solid rgba(0,0,0,0.08)",
//                             bgcolor: "rgba(0,0,0,0.01)",
//                           }}
//                         >
//                           {isWord && (
//                             <Button
//                               variant="outlined"
//                               startIcon={<PreviewIcon />}
//                               onClick={() => handlePreviewWordFile(previewUrl)}
//                               sx={{
//                                 borderRadius: 2,
//                                 flex: 1,
//                                 borderColor: "#2a5699",
//                                 color: "#2a5699",
//                                 "&:hover": {
//                                   borderColor: "#1e3c6e",
//                                   backgroundColor: "rgba(42, 86, 153, 0.04)",
//                                 },
//                               }}
//                             >
//                               תצוגה מקדימה
//                             </Button>
//                           )}
//                           <Button
//                             variant="contained"
//                             startIcon={<DownloadIcon />}
//                             href={`${baseUrl}/api/upload/download?filePath=${file.s3Key}&fileName=${file.fileName}`}
//                             sx={{
//                               borderRadius: 2,
//                               flex: 1,
//                               bgcolor: isWord ? "#2a5699" : undefined,
//                               "&:hover": {
//                                 bgcolor: isWord ? "#1e3c6e" : undefined,
//                               },
//                             }}
//                           >
//                             הורד
//                           </Button>
//                         </Box>
//                       </CardContent>
//                     </Card>
//                   </Grid>
//                 )
//               })}
//             </Grid>
//           )}
//         </Paper>
//       </Box>
//     </ThemeProvider>
//   )
// }

// export default LessonDisplay
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  Button,
  ThemeProvider,
  createTheme,
  Paper,
  Skeleton,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Fade,
  Container,
  Stack,
  Avatar,
  Badge,
} from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import type { Lesson, UploadedFileData } from "../typies/types"
import { getCookie } from "../login/Login"
import DeleteIcon from "@mui/icons-material/Delete"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import DescriptionIcon from "@mui/icons-material/Description"
import ImageIcon from "@mui/icons-material/Image"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import VisibilityIcon from "@mui/icons-material/Visibility"
import CloudDownloadIcon from "@mui/icons-material/CloudDownload"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import FolderIcon from "@mui/icons-material/Folder"
import ArticleIcon from "@mui/icons-material/Article"
import AutoStoriesIcon from "@mui/icons-material/AutoStories"
import SchoolIcon from "@mui/icons-material/School"
import LaunchIcon from "@mui/icons-material/Launch"
import GetAppIcon from "@mui/icons-material/GetApp"

// Create modern RTL theme
const theme = createTheme({
  direction: "rtl",
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb",
      light: "#3b82f6",
      dark: "#1d4ed8",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#7c3aed",
      light: "#8b5cf6",
      dark: "#6d28d9",
    },
    error: {
      main: "#dc2626",
      light: "#ef4444",
      dark: "#b91c1c",
    },
    warning: {
      main: "#d97706",
      light: "#f59e0b",
      dark: "#b45309",
    },
    success: {
      main: "#059669",
      light: "#10b981",
      dark: "#047857",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    grey: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
  },
  typography: {
    fontFamily: '"Inter", "Heebo", "Roboto", "Arial", sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: "-0.025em",
    },
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h6: {
      fontWeight: 600,
      letterSpacing: "-0.025em",
    },
    subtitle1: {
      fontWeight: 500,
    },
    body1: {
      lineHeight: 1.6,
    },
    body2: {
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    "none",
    "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
    "0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)",
    "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)",
    "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)",
    "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: "1px solid rgba(226, 232, 240, 0.8)",
          boxShadow: "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)",
            borderColor: "rgba(37, 99, 235, 0.2)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.875rem",
          padding: "10px 20px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
        },
        contained: {
          background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: "1px solid rgba(226, 232, 240, 0.8)",
        },
      },
    },
  },
})

interface DeleteDialogState {
  open: boolean
  file: UploadedFileData | null
  type: "lesson" | "original" | "processed"
}

interface SnackbarState {
  open: boolean
  message: string
  severity: "success" | "error" | "warning" | "info"
}

const LessonDisplay: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const token = getCookie("auth_token")
  const baseUrl = import.meta.env.VITE_API_URL



  const lesson = location?.state?.lesson as Lesson | undefined
  const subjectId = location?.state?.subjectId as number | undefined

  const [lessonFiles, setLessonFiles] = useState<UploadedFileData[]>([])
  const [originalSummary, setOriginalSummary] = useState<UploadedFileData>()
  const [processedSummary, setProcessedSummary] = useState<UploadedFileData>()
  const [originalUrl, setOriginalUrl] = useState<string>("")
  const [processedUrl, setProcessedUrl] = useState<string>("")
  const [originalContent, setOriginalContent] = useState<string>("")
  const [processedContent, setProcessedContent] = useState<string>("")
  const [filePreviews, setFilePreviews] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    file: null,
    type: "lesson",
  })
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  })
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({})
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!lesson) navigate("/lessons")
  }, [lesson, navigate])

  const showSnackbar = (message: string, severity: SnackbarState["severity"] = "success") => {
    setSnackbar({ open: true, message, severity })
  }

  const getPresignedUrl = async (filePath: string): Promise<string | null> => {
    try {
      const res = await axios.get(`${baseUrl}/api/upload/presigned-url/view`, {
        params: { filePath },
        headers: { Authorization: `Bearer ${token}` },
      })
      return res.data.url
    } catch (err) {
      console.error("Error getting presigned URL:", err)
      showSnackbar("שגיאה בקבלת קישור לקובץ", "error")
      return null
    }
  }

  const getDownloadUrl = async (userId: string, fileName: string): Promise<string | null> => {
    try {
      const res = await axios.get(`${baseUrl}/api/upload/download-url/${fileName}`, {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` },
      })
      return res.data.downloadUrl
    } catch (err) {
      console.error("Error getting download URL:", err)
      showSnackbar("שגיאה בקבלת קישור הורדה", "error")
      return null
    }
  }

  const getFileContent = async (url: string, fileName: string): Promise<string> => {
    try {
      if (isPdfFile(fileName)) {
        return `<iframe src="${url}" width="100%" height="200" style="border: none; border-radius: 8px;"></iframe>`
      } else if (isImageFile(fileName)) {
        return `<img src="${url}" alt="${fileName}" style="max-width: 100%; max-height: 200px; object-fit: contain; border-radius: 8px;" />`
      } else if (isWordFile(fileName)) {
        return `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 200px; background: linear-gradient(135deg, #f0f7ff 0%, #e0f2fe 100%); border-radius: 12px; border: 2px dashed #2563eb;">
          <div style="font-size: 48px; color: #2563eb; margin-bottom: 8px;">📄</div>
          <div style="font-weight: 600; color: #1e40af; margin-bottom: 4px;">${fileName}</div>
          <div style="font-size: 12px; color: #64748b;">מסמך Word - לחץ לצפייה</div>
        </div>`
      } else {
        return `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 200px; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; border: 2px dashed #64748b;">
          <div style="font-size: 48px; color: #64748b; margin-bottom: 8px;">📄</div>
          <div style="font-weight: 600; color: #475569; margin-bottom: 4px;">${fileName}</div>
          <div style="font-size: 12px; color: #64748b;">תצוגה מקדימה לא זמינה</div>
        </div>`
      }
    } catch (err) {
      console.error("Error getting file content:", err)
      return `<div style="display: flex; align-items: center; justify-content: center; height: 200px; color: #64748b;">שגיאה בטעינת התוכן</div>`
    }
  }

  const softDeleteFile = async (fileId: number): Promise<boolean> => {
    try {
      setDeletingFiles((prev) => new Set(prev).add(fileId.toString()))
      await axios.delete(`${baseUrl}/api/UploadedFile/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return true
    } catch (err) {
      console.error("Error soft deleting file:", err)
      showSnackbar("שגיאה במחיקת הקובץ", "error")
      return false
    } finally {
      setDeletingFiles((prev) => {
        const newSet = new Set(prev)
        newSet.delete(fileId.toString())
        return newSet
      })
    }
  }

  const handleDeleteFile = async () => {
    if (!deleteDialog.file) return

    const success = await softDeleteFile(Number(deleteDialog.file.id))

    if (success) {
      if (deleteDialog.type === "lesson") {
        setLessonFiles((prev) => prev.filter((f) => f.id !== deleteDialog.file?.id))
        showSnackbar("הקובץ נמחק בהצלחה", "success")
      } else if (deleteDialog.type === "original") {
        setOriginalSummary(undefined)
        setOriginalUrl("")
        setOriginalContent("")
        showSnackbar("הסיכום המקורי נמחק בהצלחה", "success")
      } else if (deleteDialog.type === "processed") {
        setProcessedSummary(undefined)
        setProcessedUrl("")
        setProcessedContent("")
        showSnackbar("הסיכום המעובד נמחק בהצלחה", "success")
      }
    }

    setDeleteDialog({ open: false, file: null, type: "lesson" })
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, fileId: string) => {
    setAnchorEl((prev) => ({ ...prev, [fileId]: event.currentTarget }))
  }

  const handleMenuClose = (fileId: string) => {
    setAnchorEl((prev) => ({ ...prev, [fileId]: null }))
  }

  const handleViewFile = async (file: UploadedFileData) => {
    const url = await getPresignedUrl(file.s3Key)
    if (url) {
      if (isWordFile(file.fileName)) {
        const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
        window.open(googleDocsViewerUrl, "_blank", "width=1200,height=800,scrollbars=yes,resizable=yes")
      } else {
        window.open(url, "_blank")
      }
    }
  }

  const handleDownloadFile = async (file: UploadedFileData) => {
    try {
      const userId = file.s3Key.split("/")[0]
      const downloadUrl = await getDownloadUrl(userId, file.fileName)

      if (downloadUrl) {
        const link = document.createElement("a")
        link.href = downloadUrl
        link.download = file.fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        showSnackbar("ההורדה החלה", "success")
      }
    } catch (err) {
      console.error("Error downloading file:", err)
      showSnackbar("שגיאה בהורדת הקובץ", "error")
    }
  }

  const fetchLessonFiles = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/UploadedFile/lesson/${lesson?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setLessonFiles(res.data)
    } catch (err) {
      console.error("Error fetching lesson files:", err)
      showSnackbar("שגיאה בטעינת קבצי השיעור", "error")
    }
  }

  const fetchSummaries = async () => {
    try {
      let original, processed

      if (lesson?.orginalSummaryId) {
        const res = await axios.get(`${baseUrl}/api/UploadedFile/id/${lesson.orginalSummaryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        original = res.data
        setOriginalSummary(original)
        const url = await getPresignedUrl(original.s3Key)
        if (url) {
          setOriginalUrl(url)
          const content = await getFileContent(url, original.fileName)
          setOriginalContent(content)
        }
      }

      if (lesson?.processedSummaryId) {
        const res = await axios.get(`${baseUrl}/api/UploadedFile/id/${lesson.processedSummaryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        processed = res.data
        setProcessedSummary(processed)
        const url = await getPresignedUrl(processed.filePath)
        if (url) {
          setProcessedUrl(url)
          const content = await getFileContent(url, processed.fileName)
          setProcessedContent(content)
        }
      }
    } catch (err) {
      console.error("Error fetching summaries:", err)
      showSnackbar("שגיאה בטעינת הסיכומים", "error")
    }
  }

  const fetchAll = async () => {
    setLoading(true)
    await Promise.all([fetchLessonFiles(), fetchSummaries()])
    setLoading(false)
  }

  useEffect(() => {
    if (lesson) fetchAll()
  }, [lesson])

  useEffect(() => {
    const fetchPreviewUrls = async () => {
      const previews: { [key: string]: string } = {}
      for (const file of lessonFiles) {
        if (file.s3Key) {
          const url = await getPresignedUrl(file.s3Key)
          if (url) previews[file.s3Key] = url
        }
      }
      setFilePreviews(previews)
    }

    if (lessonFiles.length > 0) fetchPreviewUrls()
  }, [lessonFiles])

  const isImageFile = (fileName: string) =>
    [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"].some((ext) => fileName.toLowerCase().endsWith(ext))

  const isPdfFile = (fileName: string) => fileName.toLowerCase().endsWith(".pdf")

  const isWordFile = (fileName: string) =>
    fileName.toLowerCase().endsWith(".doc") || fileName.toLowerCase().endsWith(".docx")

  const getFileIcon = (fileName: string) => {
    if (isImageFile(fileName)) return <ImageIcon sx={{ fontSize: 60, color: "primary.main" }} />
    if (isPdfFile(fileName)) return <PictureAsPdfIcon sx={{ fontSize: 60, color: "#dc2626" }} />
    if (isWordFile(fileName)) return <DescriptionIcon sx={{ fontSize: 60, color: "#2563eb" }} />
    return <InsertDriveFileIcon sx={{ fontSize: 60, color: "text.secondary" }} />
  }

  const getFileTypeLabel = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toUpperCase() || ""
    return extension
  }

  const getFileTypeColor = (fileName: string) => {
    if (isImageFile(fileName)) return "success"
    if (isPdfFile(fileName)) return "error"
    if (isWordFile(fileName)) return "primary"
    return "default"
  }

  const handleGoBack = () => {
    if (subjectId && lesson) {
      navigate("/lessons", {
        state: {
          showLessons: true,
          subjectId: lesson.subjectId,
          selectedSubject: { id: lesson.subjectId },
        },
      })
    } else {
      navigate(-1)
    }
  }

  const renderModernFileActions = (file: UploadedFileData, type: "lesson" | "original" | "processed") => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: { xs: 2, sm: 3 },
        borderTop: "1px solid",
        borderColor: "grey.200",
        bgcolor: "grey.50",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      }}
    >
      <Stack direction="row" spacing={1}>
        <Tooltip title="צפייה בקובץ" arrow>
          <IconButton
            onClick={() => handleViewFile(file)}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              "&:hover": { bgcolor: "primary.dark" },
              width: 40,
              height: 40,
            }}
          >
            <LaunchIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="הורדת קובץ" arrow>
          <IconButton
            onClick={() => handleDownloadFile(file)}
            sx={{
              bgcolor: "success.main",
              color: "white",
              "&:hover": { bgcolor: "success.dark" },
              width: 40,
              height: 40,
            }}
          >
            <GetAppIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="מחיקת קובץ" arrow>
          <IconButton
            onClick={() => setDeleteDialog({ open: true, file, type })}
            disabled={deletingFiles.has(file.id.toString())}
            sx={{
              bgcolor: "error.main",
              color: "white",
              "&:hover": { bgcolor: "error.dark" },
              "&:disabled": { bgcolor: "grey.300" },
              width: 40,
              height: 40,
            }}
          >
            {deletingFiles.has(file.id.toString()) ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <DeleteOutlineIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Stack>

      <Chip
        label={getFileTypeLabel(file.fileName)}
        color={getFileTypeColor(file.fileName) as any}
        variant="filled"
        size="small"
        sx={{
          fontWeight: 600,
          fontSize: "0.75rem",
          height: 28,
        }}
      />
    </Box>
  )

  const renderSummaryCard = (
    file: UploadedFileData | undefined,
    title: string,
    url: string,
    content: string,
    type: "original" | "processed",
    icon: React.ReactNode,
  ) => (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background:
            type === "processed"
              ? "linear-gradient(90deg, #2563eb, #3b82f6)"
              : "linear-gradient(90deg, #7c3aed, #8b5cf6)",
        }}
      />

      <CardContent sx={{ p: 0, flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ p: { xs: 2, sm: 3 }, pb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Avatar
              sx={{
                bgcolor: type === "processed" ? "primary.main" : "secondary.main",
                width: 48,
                height: 48,
              }}
            >
              {icon}
            </Avatar>
            <Typography
              variant="h6"
              align="right"
              sx={{
                fontWeight: 700,
                color: "grey.800",
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            >
              {title}
            </Typography>
          </Stack>
        </Box>

        <Box sx={{ flexGrow: 1, px: { xs: 2, sm: 3 }, pb: 3 }}>
          {loading ? (
            <Skeleton variant="rectangular" height={200} animation="wave" sx={{ borderRadius: 3 }} />
          ) : url && content ? (
            <Box
              sx={{
                border: "2px solid",
                borderColor: "grey.200",
                borderRadius: 3,
                overflow: "hidden",
                height: { xs: 180, sm: 200 },
                bgcolor: "white",
                boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: { xs: 180, sm: 200 },
                bgcolor: "grey.50",
                borderRadius: 3,
                border: "2px dashed",
                borderColor: "grey.300",
              }}
            >
              <FolderIcon sx={{ fontSize: 48, color: "grey.400", mb: 1 }} />
              <Typography align="center" color="text.secondary" variant="body2">
                {type === "original" ? "אין סיכום מקורי" : "אין סיכום מעובד"}
              </Typography>
            </Box>
          )}
        </Box>

        {file && renderModernFileActions(file, type)}
      </CardContent>
    </Card>
  )

  if (!lesson) return null

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
          {/* Header */}
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
              spacing={2}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: 800,
                    fontSize: { xs: "1.75rem", sm: "2.125rem" },
                    mb: 1,
                  }}
                >
                  {lesson.name}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <SchoolIcon sx={{ color: "grey.500", fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    שיעור מס' {lesson.id}
                  </Typography>
                </Stack>
              </Box>

              <Button
                variant="outlined"
                startIcon={<ArrowForwardIcon />}
                onClick={handleGoBack}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  borderColor: "grey.300",
                  color: "grey.700",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "primary.50",
                  },
                }}
              >
                חזרה לרשימת השיעורים
              </Button>
            </Stack>
          </Box>

          {/* Summaries Section */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              mb: { xs: 3, sm: 4 },
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Grid container spacing={{ xs: 3, sm: 4 }} direction="row-reverse">
              {/* Processed Summary */}
              <Grid item xs={12} lg={8}>
                {renderSummaryCard(
                  processedSummary,
                  "סיכום מעובד",
                  processedUrl,
                  processedContent,
                  "processed",
                  <AutoStoriesIcon />,
                )}
              </Grid>

              {/* Original Summary */}
              <Grid item xs={12} lg={4}>
                {renderSummaryCard(
                  originalSummary,
                  "סיכום מקורי",
                  originalUrl,
                  originalContent,
                  "original",
                  <ArticleIcon />,
                )}
              </Grid>
            </Grid>
          </Paper>

          {/* Additional Files Section */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
              <Badge badgeContent={lessonFiles.length} color="primary" max={99}>
                <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
                  <FolderIcon />
                </Avatar>
              </Badge>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "grey.800",
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                }}
              >
                חומרי עזר נוספים
              </Typography>
            </Stack>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress size={48} />
              </Box>
            ) : lessonFiles.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 8,
                  bgcolor: "grey.50",
                  borderRadius: 3,
                  border: "2px dashed",
                  borderColor: "grey.300",
                }}
              >
                <FolderIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  אין קבצים נוספים
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  לא נמצאו חומרי עזר נוספים לשיעור זה
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={{ xs: 2, sm: 3 }} direction="row-reverse">
                {lessonFiles.map((file, index) => {
                  const previewUrl = filePreviews[file.s3Key] || ""

                  return (
                    <Grid item xs={12} sm={6} md={4} xl={3} key={file.id}>
                      <Fade in timeout={300 + index * 100}>
                        <Card
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              height: 4,
                              background: `linear-gradient(90deg, ${
                                isImageFile(file.fileName)
                                  ? "#059669, #10b981"
                                  : isPdfFile(file.fileName)
                                    ? "#dc2626, #ef4444"
                                    : isWordFile(file.fileName)
                                      ? "#2563eb, #3b82f6"
                                      : "#64748b, #94a3b8"
                              })`,
                            }}
                          />

                          <CardContent sx={{ p: 0, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                            <Box sx={{ p: { xs: 2, sm: 3 }, pb: 2 }}>
                              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                                <IconButton
                                  size="small"
                                  onClick={(e) => handleMenuClick(e, file.id.toString())}
                                  sx={{
                                    bgcolor: "grey.100",
                                    "&:hover": { bgcolor: "grey.200" },
                                  }}
                                >
                                  <MoreVertIcon fontSize="small" />
                                </IconButton>

                                <Typography
                                  variant="subtitle1"
                                  fontWeight={600}
                                  align="right"
                                  sx={{
                                    fontSize: { xs: "0.875rem", sm: "1rem" },
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    maxWidth: "75%",
                                    color: "grey.800",
                                  }}
                                >
                                  {file.fileName}
                                </Typography>
                              </Stack>

                              <Menu
                                anchorEl={anchorEl[file.id.toString()]}
                                open={Boolean(anchorEl[file.id.toString()])}
                                onClose={() => handleMenuClose(file.id.toString())}
                                transformOrigin={{ horizontal: "right", vertical: "top" }}
                                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                                PaperProps={{
                                  sx: { borderRadius: 2, minWidth: 160 },
                                }}
                              >
                                <MenuItem
                                  onClick={() => {
                                    handleViewFile(file)
                                    handleMenuClose(file.id.toString())
                                  }}
                                >
                                  <ListItemIcon>
                                    <VisibilityIcon fontSize="small" />
                                  </ListItemIcon>
                                  <ListItemText>צפייה</ListItemText>
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    handleDownloadFile(file)
                                    handleMenuClose(file.id.toString())
                                  }}
                                >
                                  <ListItemIcon>
                                    <CloudDownloadIcon fontSize="small" />
                                  </ListItemIcon>
                                  <ListItemText>הורדה</ListItemText>
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    setDeleteDialog({ open: true, file, type: "lesson" })
                                    handleMenuClose(file.id.toString())
                                  }}
                                  sx={{ color: "error.main" }}
                                >
                                  <ListItemIcon>
                                    <DeleteOutlineIcon fontSize="small" color="error" />
                                  </ListItemIcon>
                                  <ListItemText>מחיקה</ListItemText>
                                </MenuItem>
                              </Menu>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexGrow: 1,
                                p: { xs: 2, sm: 3 },
                                pt: 0,
                              }}
                            >
                              {isImageFile(file.fileName) && previewUrl ? (
                                <Box
                                  sx={{
                                    width: "100%",
                                    height: { xs: 160, sm: 180 },
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 3,
                                    overflow: "hidden",
                                    bgcolor: "grey.50",
                                    border: "2px solid",
                                    borderColor: "grey.200",
                                  }}
                                >
                                  <img
                                    src={previewUrl || "/placeholder.svg"}
                                    alt={file.fileName}
                                    style={{
                                      maxWidth: "100%",
                                      maxHeight: "100%",
                                      objectFit: "contain",
                                    }}
                                  />
                                </Box>
                              ) : (
                                <Box
                                  sx={{
                                    width: "100%",
                                    height: { xs: 160, sm: 180 },
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 3,
                                    bgcolor: isWordFile(file.fileName) ? "blue.50" : "grey.50",
                                    border: "2px dashed",
                                    borderColor: isWordFile(file.fileName) ? "blue.200" : "grey.300",
                                  }}
                                >
                                  {getFileIcon(file.fileName)}
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      mt: 1,
                                      fontWeight: 500,
                                      color: isWordFile(file.fileName) ? "blue.700" : "grey.600",
                                      textAlign: "center",
                                    }}
                                  >
                                    {isWordFile(file.fileName) ? "מסמך Word" : "תצוגה מקדימה לא זמינה"}
                                  </Typography>
                                </Box>
                              )}
                            </Box>

                            {renderModernFileActions(file, "lesson")}
                          </CardContent>
                        </Card>
                      </Fade>
                    </Grid>
                  )
                })}
              </Grid>
            )}
          </Paper>
        </Container>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, file: null, type: "lesson" })}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              color: "error.main",
              fontWeight: 700,
              fontSize: "1.25rem",
            }}
          >
            <Avatar sx={{ bgcolor: "error.main", width: 48, height: 48 }}>
              <WarningAmberIcon />
            </Avatar>
            אישור מחיקה
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <DialogContentText
              sx={{
                textAlign: "right",
                fontSize: "1.1rem",
                color: "grey.700",
                lineHeight: 1.6,
              }}
            >
              האם אתה בטוח שברצונך למחוק את הקובץ{" "}
              <Typography component="span" fontWeight={600} color="error.main">
                "{deleteDialog.file?.fileName}"
              </Typography>
              ?
              <Typography
                component="span"
                sx={{
                  mt: 2,
                  display: "block",
                  fontSize: "0.95rem",
                  color: "warning.main",
                  fontWeight: 500,
                }}
              >
                ⚠️ הקובץ יועבר לפח המחזור ויהיה ניתן לשחזור
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={() => setDeleteDialog({ open: false, file: null, type: "lesson" })}
              variant="outlined"
              sx={{ borderRadius: 2, px: 3 }}
            >
              ביטול
            </Button>
            <Button
              onClick={handleDeleteFile}
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              disabled={deleteDialog.file ? deletingFiles.has(deleteDialog.file.id.toString()) : false}
              sx={{ borderRadius: 2, px: 3 }}
            >
              {deleteDialog.file && deletingFiles.has(deleteDialog.file.id.toString()) ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "מחק"
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            sx={{
              width: "100%",
              borderRadius: 2,
              fontWeight: 500,
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  )
}

export default LessonDisplay

