// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//     Card,
//     CardContent,
//     Typography,
//     Box,
//     Grid,
//     Paper,
//     CircularProgress,
//     ImageList,
//     ImageListItem
// } from "@mui/material";
// import { Lesson, UploadedFileData } from "../typies/types";
// import { useLocation } from "react-router-dom";
// import { getCookie } from "../login/Login";


// const LessonDisplay: React.FC = () => {

//     const location = useLocation();
//     const lesson = location.state.lesson as Lesson;
//     console.log(lesson);

//     const [lessonFiles, setLessonFiles] = useState<UploadedFileData[]>([]);
//     const [originalSummary, setOriginalSummary] = useState<UploadedFileData>();
//     const [processedSummary, setProcessedSummary] = useState<UploadedFileData>();
//     const [loading, setLoading] = useState<boolean>(true);
//     const token=getCookie("auth_token")


//     // הוסף את זה לפני ה-return
// const [processedUrl, setProcessedUrl] = useState<string>();
// const [originalUrl, setOriginalUrl] = useState<string>();
// const [filePreviews, setFilePreviews] = useState<{ [key: string]: string }>({});

// const getPresignedUrl = async (filePath: string): Promise<string | null> => {
//     try {
//         const res = await axios.get(
//             `https://localhost:7249/api/upload/presigned-url/view?filePath=${encodeURIComponent(filePath)}`,
//             { headers: { Authorization: `Bearer ${token}` } }
//         );
//         return res.data; // מניח שזו מחרוזת URL
//     } catch (err) {
//         console.error("Error getting presigned URL:", err);
//         return null;
//     }
// };

// useEffect(() => {
//     const fetchUrls = async () => {
//         if (processedSummary?.filePath) {
//             const url = await getPresignedUrl(processedSummary.filePath);
//             if (url) setProcessedUrl(url);
//         }
//         if (originalSummary?.filePath) {
//             const url = await getPresignedUrl(originalSummary.filePath);
//             if (url) setOriginalUrl(url);
//         }
//     };
//     fetchUrls();
// }, [processedSummary, originalSummary]);

// useEffect(() => {
//     const fetchPreviewUrls = async () => {
//         const previews: { [key: string]: string } = {};
//         for (const file of lessonFiles) {
//             if (file.filePath) {
//                 const url = await getPresignedUrl(file.filePath);
//                 if (url) {
//                     previews[file.filePath] = url;
//                 }
//             }
//         }
//         setFilePreviews(previews);
//     };

//     if (lessonFiles.length > 0) {
//         fetchPreviewUrls();
//     }
// }, [lessonFiles]);


//     const fetchLessonFiles = async () => {
//         try {
//             const response = await axios.get(
//                 `https://localhost:7249/api/UploadedFile/lesson/${lesson.id}`,
//                 { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
//             );
//             setLessonFiles(response.data);
//         } catch (error) {
//             console.error("Error fetching lesson files:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchSummaries = async () => {
//         try {
//             console.log(lesson.orginalSummaryId);
            
//             const response = await axios.get(
//                 `https://localhost:7249/api/UploadedFile/id/${lesson.orginalSummaryId}`,
//                 { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
//             );
//            setOriginalSummary(response.data);
//         } catch (error) {
//             console.error("Error fetching original Summary:", error);
//         } 
//         finally {
//             setLoading(false);
//         }
//         try {
//             const response = await axios.get(

//                 `https://localhost:7249/api/UploadedFile/id/${lesson.processedSummaryId}`,
//                 { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
//             );
//            setProcessedSummary(response.data);
//         } catch (error) {
//             console.error("Error fetching processed Summary:", error);
//         } finally {
//             setLoading(false);
//         }
//     }
//     useEffect(() => {
//         fetchLessonFiles();
//         fetchSummaries();
//         console.log("originalSummary",originalSummary);
//         console.log("processedSummary",processedSummary);
        
//     }, []);

//     useEffect(() => {
//         console.log("originalSummary updated:", originalSummary);
//         console.log("processedSummary updated:", processedSummary);
//     }, [originalSummary, processedSummary]);
//     return (
//         <Box className="p-4 space-y-4">
//             <Typography variant="h4" fontWeight="bold">
//                 {lesson.name}
//             </Typography>

//             <Grid container spacing={4}>
//                 {/* Processed Summary */}
//                 <Grid item xs={12} md={8}>
//                     <Card className="rounded-2xl shadow-md">
//                         <CardContent>
//                             <Typography variant="h6" gutterBottom>
//                                 סיכום מעובד (Processed Summary)
//                             </Typography>
//                             {lesson.processedSummaryId ? (
//                               <iframe
//                               src={processedUrl}
//                               title="Processed Summary"
//                               className="w-full h-96 rounded-lg border"
//                           />
                          
//                             ) : (
//                                 <Typography color="text.secondary">אין סיכום מעובד.</Typography>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </Grid>

//                 {/* Original Summary */}
//                 <Grid item xs={12} md={4}>
//                     <Card className="rounded-2xl shadow-md">
//                         <CardContent>
//                             <Typography variant="h6" gutterBottom>
//                                 סיכום מקורי (Original Summary)
//                             </Typography>
//                             {lesson.orginalSummaryId ? (
//                                <iframe
//                                src={originalUrl}
//                                title="Original Summary"
//                                className="w-full h-96 rounded-lg border"
//                            />
                           
//                             ) : (
//                                 <Typography color="text.secondary">אין סיכום מקורי.</Typography>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </Grid>
//             </Grid>

//             {/* Additional Files */}
//             <Box>
//                 <Typography variant="h6" gutterBottom>
//                     קבצי עזר נוספים
//                 </Typography>

//                 {loading ? (
//                     <CircularProgress />
//                 ) : lessonFiles.length > 0 ? (
//                     <ImageList cols={6} rowHeight={100} gap={16}>
//                        {lessonFiles.map((file, index) => (
//     <ImageListItem key={index}>
//         <a href={filePreviews[file.filePath]} target="_blank" rel="noopener noreferrer">
//             <img
//                 src={filePreviews[file.filePath]}
//                 alt={file.fileName}
//                 loading="lazy"
//                 className="rounded-xl shadow"
//             />
//         </a>
//     </ImageListItem>
// ))}

//                     </ImageList>
//                 ) : (
//                     <Typography color="text.secondary">אין קבצים נוספים.</Typography>
//                 )}
//             </Box>
//         </Box>
//     );
// };

// export default LessonDisplay;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Box,
//   Card,
//   CardContent,
//   CircularProgress,
//   Grid,
//   ImageList,
//   ImageListItem,
//   Typography,
// } from "@mui/material";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Lesson, UploadedFileData } from "../typies/types";
// import { getCookie } from "../login/Login";

// const LessonDisplay: React.FC = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const token = getCookie("auth_token");
//   const baseUrl = "https://localhost:7249/api";
//   const lesson = location?.state?.lesson as Lesson | undefined;

//   // אם מישהו הגיע בלי נתונים, שלח אותו חזרה
//   useEffect(() => {
//     if (!lesson) {
//       navigate("/lessons"); // או דף אחר
//     }
//   }, [lesson, navigate]);

//   const [lessonFiles, setLessonFiles] = useState<UploadedFileData[]>([]);
//   const [originalSummary, setOriginalSummary] = useState<UploadedFileData>();
//   const [processedSummary, setProcessedSummary] = useState<UploadedFileData>();
//   const [originalUrl, setOriginalUrl] = useState<string>("");
//   const [processedUrl, setProcessedUrl] = useState<string>("");
//   const [filePreviews, setFilePreviews] = useState<{ [key: string]: string }>({});
//   const [loading, setLoading] = useState<boolean>(true);

//   const getPresignedUrl = async (filePath: string): Promise<string | null> => {
//     try {
//       const res = await axios.get(`${baseUrl}/upload/presigned-url/view`, {
//         params: { filePath: filePath },
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return res.data;
//     } 
//     catch (err) {
//       console.error("Error getting presigned URL:", err);
//       return null;
//     }
//   };

//   const fetchLessonFiles = async () => {
//     try {
//       const res = await axios.get(
//         `${baseUrl}/UploadedFile/lesson/${lesson?.id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setLessonFiles(res.data);
//     } catch (err) {
//       console.error("Error fetching lesson files:", err);
//     }
//   };

//   const fetchSummaries = async () => {
//     try {
//       if (lesson?.orginalSummaryId) {
//         const res = await axios.get(
//           `${baseUrl}/UploadedFile/id/${lesson.orginalSummaryId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setOriginalSummary(res.data);
//       }

//       if (lesson?.processedSummaryId) {
//         const res = await axios.get(
//           `${baseUrl}/UploadedFile/id/${lesson.processedSummaryId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setProcessedSummary(res.data);
//       }
//     } catch (err) {
//       console.error("Error fetching summaries:", err);
//     }
//   };

//   const fetchAll = async () => {
//     setLoading(true);
//     await Promise.all([fetchLessonFiles(), fetchSummaries()]);
//     setLoading(false);
//   };

//   useEffect(() => {
//     if (lesson) fetchAll();
//   }, [lesson]);

//   useEffect(() => {
//     const fetchUrls = async () => {
//       if (originalSummary?.filePath) {
//         const url = await getPresignedUrl(originalSummary.filePath);
//         if (url) setOriginalUrl(url);
//       }
//       if (processedSummary?.filePath) {
//         const url = await getPresignedUrl(processedSummary.filePath);
//         if (url) setProcessedUrl(url);
//       }
//     };
//     fetchUrls();
//   }, [originalSummary, processedSummary]);

//   useEffect(() => {
//     const fetchPreviewUrls = async () => {
//       const previews: { [key: string]: string } = {};
//       for (const file of lessonFiles) {
//         if (file.filePath) {
//           const url = await getPresignedUrl(file.filePath);
//           if (url) previews[file.filePath] = url;
//         }
//       }
//       setFilePreviews(previews);
//     };

//     if (lessonFiles.length > 0) {
//       fetchPreviewUrls();
//     }
//   }, [lessonFiles]);

//   if (!lesson) return null;

//   return (
//     <Box className="p-4 space-y-4">
//       <Typography variant="h4" fontWeight="bold">
//         {lesson.name}
//       </Typography>

//       <Grid container spacing={4}>
//         {/* Processed Summary */}
//         <Grid item xs={12} md={8}>
//           <Card className="rounded-2xl shadow-md">
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 סיכום מעובד (Processed Summary)
//               </Typography>
//               {processedUrl ? (
//                 <iframe
//                   src={processedUrl}
//                   title="Processed Summary"
//                   className="w-full h-96 rounded-lg border"
//                 />
//               ) : (
//                 <Typography color="text.secondary">אין סיכום מעובד.</Typography>
//               )}
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Original Summary */}
//         <Grid item xs={12} md={4}>
//           <Card className="rounded-2xl shadow-md">
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 סיכום מקורי (Original Summary)
//               </Typography>
//               {originalUrl ? (
//                 <iframe
//                   src={originalUrl}
//                   title="Original Summary"
//                   className="w-full h-96 rounded-lg border"
//                 />
//               ) : (
//                 <Typography color="text.secondary">אין סיכום מקורי.</Typography>
//               )}
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Additional Files */}
//       <Box>
//         <Typography variant="h6" gutterBottom>
//           קבצי עזר נוספים
//         </Typography>
//         {loading ? (
//           <CircularProgress />
//         ) : lessonFiles.length > 0 ? (
//           <ImageList cols={6} rowHeight={100} gap={16}>
//             {lessonFiles.map((file, idx) => (
//               <ImageListItem key={idx}>
//                 <a
//                   href={filePreviews[file.filePath]}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <img
//                     src={filePreviews[file.filePath]}
//                     alt={file.fileName}
//                     loading="lazy"
//                     className="rounded-xl shadow"
//                   />
//                 </a>
//               </ImageListItem>
//             ))}
//           </ImageList>
//         ) : (
//           <Typography color="text.secondary">אין קבצים נוספים.</Typography>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default LessonDisplay;




import React, { useEffect, useState } from "react";
import axios from "axios";
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
  Grid2,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { Lesson, UploadedFileData } from "../typies/types";
import { getCookie } from "../login/Login";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DownloadIcon from "@mui/icons-material/Download";

// הגדרת ערכת נושא מימין לשמאל
const theme = createTheme({
  direction: "rtl",
});

const LessonDisplay: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = getCookie("auth_token");
  const baseUrl = "https://localhost:7249/api";
  const lesson = location?.state?.lesson as Lesson | undefined;

  useEffect(() => {
    if (!lesson) {
      navigate("/lessons");
    }
    console.log(lesson);
    
  }, [lesson, navigate]);

  const [lessonFiles, setLessonFiles] = useState<UploadedFileData[]>([]);
  const [originalSummary, setOriginalSummary] = useState<UploadedFileData>();
  const [processedSummary, setProcessedSummary] = useState<UploadedFileData>();
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [processedUrl, setProcessedUrl] = useState<string>("");
  const [filePreviews, setFilePreviews] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);

  const getPresignedUrl = async (filePath: string): Promise<string | null> => {
    // debugger
    console.log("filePath", filePath);
    
    try {
      const res = await axios.get(`${baseUrl}/upload/presigned-url/view`, {
        params: { filePath },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
console.log("res",res.data.url);

      return res.data.url;
    } catch (err) {
      console.error("Error getting presigned URL:", err);
      return null;
    }
  };

  const fetchLessonFiles = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/UploadedFile/lesson/${lesson?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setLessonFiles(res.data);
    } catch (err) {
      console.error("Error fetching lesson files:", err);
    }
  };

  // const fetchSummaries = async () => {
  //   try {
  //     if (lesson?.orginalSummaryId) {
  //       const res = await axios.get(
  //         `${baseUrl}/UploadedFile/id/${lesson.orginalSummaryId}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //       setOriginalSummary(res.data);
  //     }

  //     if (lesson?.processedSummaryId) {
  //       const res = await axios.get(
  //         `${baseUrl}/UploadedFile/id/${lesson.processedSummaryId}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //       setProcessedSummary(res.data);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching summaries:", err);
  //   }
  // };
  const fetchSummaries = async () => {
    try {
      let original: UploadedFileData | undefined;
      let processed: UploadedFileData | undefined;
  
      if (lesson?.orginalSummaryId) {
        const res = await axios.get(`${baseUrl}/UploadedFile/id/${lesson.orginalSummaryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("orginal gggg",res);
        
        original = res.data;
        setOriginalSummary(original);
      }
  
      if (lesson?.processedSummaryId) {
        const res = await axios.get(`${baseUrl}/UploadedFile/id/${lesson.processedSummaryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("processed gggg",res);
        processed = res.data;
        setProcessedSummary(processed);
      }
  
      // שליפת כתובות רק אחרי ששניהם התקבלו
      if (original?.filePath) {
        const url = await getPresignedUrl("4/מלחמת ששת הימים.docx");
        console.log("url rrrr",url);
        if (url) setOriginalUrl(url);
      }
      if (processed?.filePath) {
        const url = await getPresignedUrl(processed.filePath);
        if (url) setProcessedUrl(url);
      }
    } catch (err) {
      console.error("Error fetching summaries:", err);
    }
  };
  
  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchLessonFiles(), fetchSummaries()]);
    setLoading(false);
  };

  useEffect(() => {
    if (lesson) fetchAll();
  }, [lesson]);

  useEffect(() => {
    const fetchUrls = async () => {
      if (originalSummary?.filePath) {
        const url = await getPresignedUrl(originalSummary.filePath);
        if (url) setOriginalUrl(url);
      }
      if (processedSummary?.filePath) {
        const url = await getPresignedUrl(processedSummary.filePath);
        if (url) setProcessedUrl(url);
      }
    };
    fetchUrls();
  }, [originalSummary, processedSummary]);
  const isImageFile = (fileName: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    const lowerCaseFileName = fileName.toLowerCase();
    return imageExtensions.some(ext => lowerCaseFileName.endsWith(ext));
  };
  useEffect(() => {
    const fetchPreviewUrls = async () => {
      const previews: { [key: string]: string } = {};
      for (const file of lessonFiles) {
        if (file.filePath) {
          const url = await getPresignedUrl(file.filePath);
          if (url) previews[file.filePath] = url;
        }
      }
      setFilePreviews(previews);
    };

    if (lessonFiles.length > 0) {
      fetchPreviewUrls();
    }
  }, [lessonFiles]);

  if (!lesson) return null;

  return (
    <ThemeProvider theme={theme}>
      <Box className="p-4 space-y-4">
        <Typography variant="h4" fontWeight="bold" gutterBottom align="right">
          {lesson.name}
        </Typography>

        <Grid container spacing={4} direction="row-reverse">
          {/* סיכום מעובד (גדול) */}
          <Grid item xs={12} md={8}>
            <Card className="rounded-2xl shadow-md h-full flex flex-col">
              <CardContent className="flex-grow" dir="rtl">
                <Typography variant="h6" gutterBottom align="right">
                  סיכום מעובד
                </Typography>
                {processedUrl ? (
                  <iframe
                    src={processedUrl}
                    title="Processed Summary"
                    className="w-full h-full rounded-lg border"
                  />
                ) : (
                  <Typography color="text.secondary" align="right">
                    אין סיכום מעובד.
                  </Typography>
                )}
              </CardContent>
              {processedSummary?.filePath && (
                <CardContent className="border-t flex justify-end">
                  <Button
                    startIcon={<OpenInNewIcon />}
                    href={processedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                  >
                    פתח בחלון חדש
                  </Button>
                  <Button
                    startIcon={<DownloadIcon />}
                    href={`${baseUrl}/upload/download?filePath=${processedSummary.filePath}&fileName=${processedSummary.fileName}`}
                    size="small"
                    className="mr-2" // שינוי מ-ml ל-mr
                  >
                    הורד
                  </Button>
                </CardContent>
              )}
            </Card>
          </Grid>

          {/* סיכום מקורי (קטן) */}
          <Grid item xs={12} md={4}>
            <Card className="rounded-2xl shadow-md h-full flex flex-col">
              <CardContent className="flex-grow" dir="rtl">
                <Typography variant="h6" gutterBottom align="right">
                  סיכום מקורי
                </Typography>
                {originalUrl ? (
                  <iframe
                    src={originalUrl}
                    title="Original Summary"
                    className="w-full h-64 rounded-lg border" // גובה קטן יותר
                  />
                ) : (
                  <Typography color="text.secondary" align="right">
                    אין סיכום מקורי.
                  </Typography>
                )}
              </CardContent>
              {originalUrl && (
                <CardContent className="border-t flex justify-end">
                  <Button
                    startIcon={<OpenInNewIcon />}
                    href={originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                  >
                    פתח בחלון חדש
                  </Button>
                  <Button
                    startIcon={<DownloadIcon />}
                    href={`${baseUrl}/upload/download?filePath=${originalSummary}&fileName=${originalSummary?.fileName}`}
                    size="small"
                    className="mr-2" // שינוי מ-ml ל-mr
                  >
                    הורד
                  </Button>
                </CardContent>
              )}
            </Card>
          </Grid>
        </Grid>

        {/* חומרי עזר נוספים (שורות קטנות למטה) */}
        <Box className="mt-4" dir="rtl">
          <Typography variant="h6" gutterBottom align="right">
            חומרי עזר נוספים
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : lessonFiles.length > 0 ? (
            <Grid container spacing={2} direction="row-reverse">
            {lessonFiles.map((file, idx) => (
            
              <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
              
                <Card className="rounded-xl shadow-sm">
                  {filePreviews[file.filePath] ? (
                    <iframe
                      src={filePreviews[file.filePath]}
                      title={file.fileName}
                      className="w-full h-48 rounded-t-xl border"
                    />
                  ) : (
                    <Box className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-t-xl">
                      <Typography variant="body2" color="text.secondary">אין תצוגה זמינה</Typography>
                    </Box>
                  )}
                  <CardContent>
                    <Typography variant="subtitle2" noWrap align="right">
                      {file.fileName}
                    </Typography>
                    <Button
                      startIcon={<OpenInNewIcon />}
                      href={filePreviews[file.filePath]}
                      target="_blank"
                      size="small"
                    >
                      פתח
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
    
            </Grid>
          ) : (
            <Typography color="text.secondary" align="right">
              אין קבצים נוספים.
            </Typography>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LessonDisplay;


