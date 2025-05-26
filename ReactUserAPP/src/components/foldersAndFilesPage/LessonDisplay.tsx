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
  Divider,
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

// Create RTL theme with custom colors
const theme = createTheme({
  direction: "rtl",
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
    error: {
      main: "#d32f2f",
    },
    warning: {
      main: "#ed6c02",
    },
    success: {
      main: "#2e7d32",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Heebo", "Roboto", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
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

  const deleteFile = async (fileKey: string): Promise<boolean> => {
    try {
      setDeletingFiles((prev) => new Set(prev).add(fileKey))
      await axios.delete(`${baseUrl}/api/upload/${encodeURIComponent(fileKey)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return true
    } catch (err) {
      console.error("Error deleting file:", err)
      showSnackbar("שגיאה במחיקת הקובץ", "error")
      return false
    } finally {
      setDeletingFiles((prev) => {
        const newSet = new Set(prev)
        newSet.delete(fileKey)
        return newSet
      })
    }
  }

  const handleDeleteFile = async () => {
    if (!deleteDialog.file) return

    const success = await deleteFile(deleteDialog.file.s3Key)

    if (success) {
      if (deleteDialog.type === "lesson") {
        setLessonFiles((prev) => prev.filter((f) => f.id !== deleteDialog.file?.id))
        showSnackbar("הקובץ נמחק בהצלחה", "success")
      } else if (deleteDialog.type === "original") {
        setOriginalSummary(undefined)
        setOriginalUrl("")
        showSnackbar("הסיכום המקורי נמחק בהצלחה", "success")
      } else if (deleteDialog.type === "processed") {
        setProcessedSummary(undefined)
        setProcessedUrl("")
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
        window.open(googleDocsViewerUrl, "_blank")
      } else {
        window.open(url, "_blank")
      }
    }
  }

  const handleDownloadFile = async (file: UploadedFileData) => {
    try {
      // Extract userId from file path (assuming format: userId/filename)
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
        if (url) setOriginalUrl(url)
      }

      if (lesson?.processedSummaryId) {
        const res = await axios.get(`${baseUrl}/api/UploadedFile/id/${lesson.processedSummaryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        processed = res.data
        setProcessedSummary(processed)
        const url = await getPresignedUrl(processed.filePath)
        if (url) setProcessedUrl(url)
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
    [".jpg", ".jpeg", ".png", ".gif", ".bmp"].some((ext) => fileName.toLowerCase().endsWith(ext))

  const isPdfFile = (fileName: string) => fileName.toLowerCase().endsWith(".pdf")

  const isWordFile = (fileName: string) =>
    fileName.toLowerCase().endsWith(".doc") || fileName.toLowerCase().endsWith(".docx")

  const getFileIcon = (fileName: string) => {
    if (isImageFile(fileName)) return <ImageIcon sx={{ fontSize: 60, color: "primary.main", opacity: 0.8 }} />
    if (isPdfFile(fileName)) return <PictureAsPdfIcon sx={{ fontSize: 60, color: "#e53935", opacity: 0.8 }} />
    if (isWordFile(fileName)) return <DescriptionIcon sx={{ fontSize: 60, color: "#2a5699", opacity: 0.8 }} />
    return <InsertDriveFileIcon sx={{ fontSize: 60, color: "text.secondary", opacity: 0.8 }} />
  }

  const getFileTypeLabel = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toUpperCase() || ""
    return extension
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

  const renderFileActions = (file: UploadedFileData, type: "lesson" | "original" | "processed") => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 1,
        p: 2,
        borderTop: "1px solid rgba(0,0,0,0.08)",
        bgcolor: "rgba(0,0,0,0.01)",
      }}
    >
      <Tooltip title="צפייה בקובץ">
        <Button
          variant="outlined"
          startIcon={<VisibilityIcon />}
          onClick={() => handleViewFile(file)}
          size="small"
          sx={{ borderRadius: 2, flex: 1 }}
        >
          צפייה
        </Button>
      </Tooltip>

      <Tooltip title="הורדת קובץ">
        <Button
          variant="contained"
          startIcon={<CloudDownloadIcon />}
          onClick={() => handleDownloadFile(file)}
          size="small"
          sx={{ borderRadius: 2, flex: 1 }}
        >
          הורדה
        </Button>
      </Tooltip>

      <Tooltip title="מחיקת קובץ">
        <IconButton
          color="error"
          onClick={() => setDeleteDialog({ open: true, file, type })}
          disabled={deletingFiles.has(file.s3Key)}
          sx={{
            border: "1px solid",
            borderColor: "error.main",
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "error.main",
              color: "white",
            },
          }}
        >
          {deletingFiles.has(file.s3Key) ? <CircularProgress size={20} color="inherit" /> : <DeleteOutlineIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  )

  const renderFileCard = (file: UploadedFileData, title: string, url: string, type: "original" | "processed") => (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ p: 0, flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography
            variant="h6"
            align="right"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            <DescriptionIcon color="primary" />
            {title}
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1, px: 3, pb: 3 }}>
          {loading ? (
            <Skeleton variant="rectangular" height={180} animation="wave" />
          ) : url ? (
            <Box
              sx={{
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: 2,
                overflow: "hidden",
                height: "180px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "inset 0 0 10px rgba(0,0,0,0.03)",
                bgcolor: "rgba(0,0,0,0.02)",
              }}
            >
              {isPdfFile(file?.fileName || "") ? (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <PictureAsPdfIcon sx={{ fontSize: 60, color: "#e53935", mb: 1 }} />
                  <Typography
                    variant="body2"
                    sx={{ color: "#e53935", fontWeight: "medium", textAlign: "center", px: 2 }}
                  >
                    {file?.fileName}
                  </Typography>
                  <Typography color="text.secondary" variant="caption" sx={{ mt: 1 }}>
                    מסמך PDF
                  </Typography>
                </Box>
              ) : isWordFile(file?.fileName || "") ? (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 2,
                    bgcolor: "rgba(240, 247, 255, 0.5)",
                    border: "1px solid rgba(42, 86, 153, 0.2)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: "8px", bgcolor: "#2a5699" }} />
                  <DescriptionIcon sx={{ fontSize: 60, color: "#2a5699", mb: 1 }} />
                  <Typography
                    variant="body2"
                    sx={{ color: "#2a5699", fontWeight: "medium", textAlign: "center", px: 2 }}
                  >
                    {file?.fileName}
                  </Typography>
                  <Typography color="text.secondary" variant="caption" sx={{ mt: 1 }}>
                    מסמך Word
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <DescriptionIcon sx={{ fontSize: 60, color: "primary.main", mb: 1 }} />
                  <Typography
                    variant="body2"
                    sx={{ color: "primary.main", fontWeight: "medium", textAlign: "center", px: 2 }}
                  >
                    {file?.fileName}
                  </Typography>
                  <Typography color="text.secondary" variant="caption" sx={{ mt: 1 }}>
                    מסמך
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "180px",
                bgcolor: "rgba(0,0,0,0.02)",
                borderRadius: 2,
              }}
            >
              <Typography align="center" color="text.secondary">
                {type === "original" ? "אין סיכום מקורי." : "אין סיכום מעובד."}
              </Typography>
            </Box>
          )}
        </Box>

        {file && renderFileActions(file, type)}
      </CardContent>
    </Card>
  )

  if (!lesson) return null

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4, px: { xs: 2, sm: 4, md: 6 } }}>
        {/* Back Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button variant="outlined" startIcon={<ArrowForwardIcon />} onClick={handleGoBack} sx={{ borderRadius: 2 }}>
            חזרה לרשימת השיעורים
          </Button>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 3,
            mb: 4,
            background: "linear-gradient(135deg, #f5f7ff 0%, #ffffff 100%)",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <Typography
            variant="h4"
            align="right"
            sx={{
              color: "primary.main",
              mb: 1,
              fontSize: { xs: "1.5rem", sm: "2rem" },
            }}
          >
            {lesson.name}
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Grid container spacing={4} direction="row-reverse">
            {/* סיכום מעובד */}
            <Grid item xs={12} md={8}>
              {renderFileCard(processedSummary!, "סיכום מעובד", processedUrl, "processed")}
            </Grid>

            {/* סיכום מקורי */}
            <Grid item xs={12} md={4}>
              {renderFileCard(originalSummary!, "סיכום מקורי", originalUrl, "original")}
            </Grid>
          </Grid>
        </Paper>

        {/* חומרי עזר */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 3,
            background: "#ffffff",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1, mb: 3 }}>
            <Typography variant="h6" align="right" sx={{ color: "primary.main" }}>
              חומרי עזר נוספים
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : lessonFiles.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
                bgcolor: "rgba(0,0,0,0.02)",
                borderRadius: 2,
                my: 2,
              }}
            >
              <Typography align="center" color="text.secondary">
                אין קבצים נוספים.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3} direction="row-reverse">
              {lessonFiles.map((file) => {
                const previewUrl = filePreviews[file.s3Key] || ""
                const fileType = getFileTypeLabel(file.fileName)
                const isWord = isWordFile(file.fileName)

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={file.id}>
                    <Fade in timeout={300}>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-4px)",
                          },
                        }}
                      >
                        <CardContent sx={{ p: 0, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                          <Box
                            sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Chip
                                label={fileType}
                                size="small"
                                color={isWord ? "info" : "primary"}
                                variant="outlined"
                                sx={{ height: 22, fontSize: "0.7rem", fontWeight: "bold" }}
                              />
                              <IconButton
                                size="small"
                                onClick={(e) => handleMenuClick(e, file.id.toString())}
                                sx={{ ml: 1 }}
                              >
                                <MoreVertIcon fontSize="small" />
                              </IconButton>
                              <Menu
                                anchorEl={anchorEl[file.id.toString()]}
                                open={Boolean(anchorEl[file.id.toString()])}
                                onClose={() => handleMenuClose(file.id.toString())}
                                transformOrigin={{ horizontal: "right", vertical: "top" }}
                                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
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

                            <Typography
                              variant="subtitle1"
                              fontWeight="medium"
                              align="right"
                              sx={{
                                mb: 1,
                                fontSize: "0.95rem",
                                maxWidth: "75%",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {file.fileName}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              flexGrow: 1,
                              p: 2,
                              pt: 0,
                            }}
                          >
                            {isImageFile(file.fileName) && previewUrl ? (
                              <Box
                                sx={{
                                  width: "100%",
                                  height: 180,
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  borderRadius: 2,
                                  overflow: "hidden",
                                  bgcolor: "rgba(0,0,0,0.02)",
                                  border: "1px solid rgba(0,0,0,0.08)",
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
                            ) : isWord ? (
                              <Box
                                sx={{
                                  width: "100%",
                                  height: 180,
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  borderRadius: 2,
                                  bgcolor: "rgba(240, 247, 255, 0.5)",
                                  border: "1px solid rgba(42, 86, 153, 0.2)",
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
                                    height: "8px",
                                    bgcolor: "#2a5699",
                                  }}
                                />
                                <DescriptionIcon sx={{ fontSize: 60, color: "#2a5699", mb: 1 }} />
                                <Typography
                                  variant="body2"
                                  sx={{ color: "#2a5699", fontWeight: "medium", textAlign: "center", px: 2 }}
                                >
                                  {file.fileName}
                                </Typography>
                                <Typography color="text.secondary" variant="caption" sx={{ mt: 1 }}>
                                  מסמך Word
                                </Typography>
                              </Box>
                            ) : (
                              <Box
                                sx={{
                                  width: "100%",
                                  height: 180,
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  borderRadius: 2,
                                  bgcolor: "rgba(0,0,0,0.02)",
                                  border: "1px solid rgba(0,0,0,0.08)",
                                }}
                              >
                                {getFileIcon(file.fileName)}
                                <Typography color="text.secondary" variant="caption" sx={{ mt: 1 }}>
                                  תצוגה מקדימה לא זמינה
                                </Typography>
                              </Box>
                            )}
                          </Box>

                          {renderFileActions(file, "lesson")}
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>
                )
              })}
            </Grid>
          )}
        </Paper>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, file: null, type: "lesson" })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, color: "error.main" }}>
            <WarningAmberIcon />
            אישור מחיקה
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ textAlign: "right", fontSize: "1.1rem" }}>
              האם אתה בטוח שברצונך למחוק את הקובץ <strong>"{deleteDialog.file?.fileName}"</strong>?
              <br />
              <Typography component="span" color="error" sx={{ mt: 1, display: "block", fontSize: "0.9rem" }}>
                פעולה זו אינה ניתנת לביטול!
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={() => setDeleteDialog({ open: false, file: null, type: "lesson" })}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              ביטול
            </Button>
            <Button
              onClick={handleDeleteFile}
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              disabled={deleteDialog.file ? deletingFiles.has(deleteDialog.file.s3Key) : false}
              sx={{ borderRadius: 2 }}
            >
              {deleteDialog.file && deletingFiles.has(deleteDialog.file.s3Key) ? (
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
            sx={{ width: "100%", borderRadius: 2 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  )
}

export default LessonDisplay

