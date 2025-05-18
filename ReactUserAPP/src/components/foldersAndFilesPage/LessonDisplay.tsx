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
} from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import type { Lesson, UploadedFileData } from "../typies/types"
import { getCookie } from "../login/Login"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import DownloadIcon from "@mui/icons-material/Download"
import DescriptionIcon from "@mui/icons-material/Description"
import ImageIcon from "@mui/icons-material/Image"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"
import PreviewIcon from "@mui/icons-material/Preview"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"

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

const LessonDisplay: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const token = getCookie("auth_token")
  const baseUrl = "https://localhost:7249/api"
  const lesson = location?.state?.lesson as Lesson | undefined
  const subjectId = location?.state?.subjectId as number | undefined
  const type = location?.state?.type as "PUBLIC" | "PERSONAL" | undefined

  const [lessonFiles, setLessonFiles] = useState<UploadedFileData[]>([])
  const [originalSummary, setOriginalSummary] = useState<UploadedFileData>()
  const [processedSummary, setProcessedSummary] = useState<UploadedFileData>()
  const [originalUrl, setOriginalUrl] = useState<string>("")
  const [processedUrl, setProcessedUrl] = useState<string>("")
  const [filePreviews, setFilePreviews] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!lesson) navigate("/lessons")
  }, [lesson, navigate])

  const getPresignedUrl = async (filePath: string): Promise<string | null> => {
    try {
      const res = await axios.get(`${baseUrl}/upload/presigned-url/view`, {
        params: { filePath },
        headers: { Authorization: `Bearer ${token}` },
      })
      return res.data.url
    } catch (err) {
      console.error("Error getting presigned URL:", err)
      return null
    }
  }

  const fetchLessonFiles = async () => {
    try {
      const res = await axios.get(`${baseUrl}/UploadedFile/lesson/${lesson?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setLessonFiles(res.data)
    } catch (err) {
      console.error("Error fetching lesson files:", err)
    }
  }

  const fetchSummaries = async () => {
    try {
      let original, processed

      if (lesson?.orginalSummaryId) {
        const res = await axios.get(`${baseUrl}/UploadedFile/id/${lesson.orginalSummaryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        original = res.data
        setOriginalSummary(original)
        const url = await getPresignedUrl(original.s3Key)
        if (url) setOriginalUrl(url)
      }

      if (lesson?.processedSummaryId) {
        const res = await axios.get(`${baseUrl}/UploadedFile/id/${lesson.processedSummaryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        processed = res.data
        setProcessedSummary(processed)
        const url = await getPresignedUrl(processed.filePath)
        if (url) setProcessedUrl(url)
      }
    } catch (err) {
      console.error("Error fetching summaries:", err)
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

  const getFileIcon = (fileName: string) => {
    if (isImageFile(fileName)) return <ImageIcon sx={{ fontSize: 60, color: "primary.main", opacity: 0.8 }} />
    if (isPdfFile(fileName)) return <PictureAsPdfIcon sx={{ fontSize: 60, color: "#e53935", opacity: 0.8 }} />
    if (fileName.toLowerCase().endsWith(".doc") || fileName.toLowerCase().endsWith(".docx"))
      return <DescriptionIcon sx={{ fontSize: 60, color: "#2a5699", opacity: 0.8 }} />
    return <InsertDriveFileIcon sx={{ fontSize: 60, color: "text.secondary", opacity: 0.8 }} />
  }

  const getFileTypeLabel = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toUpperCase() || ""
    return extension
  }

  const isWordFile = (fileName: string) =>
    fileName.toLowerCase().endsWith(".doc") || fileName.toLowerCase().endsWith(".docx")

  // Function to handle the back button click
  const handleGoBack = () => {
    // If we have subjectId and type, we can return to the subject's lessons list
    if (subjectId && lesson) {
      // Navigate back to the parent component, but pass the necessary state to show lessons
      navigate("/lessons", {
        state: {
          showLessons: true,
          subjectId: lesson.subjectId,
          selectedSubject: { id: lesson.subjectId },
        },
      })
    } else {
      // Otherwise just go back
      navigate(-1)
    }
  }

  // Function to handle Word file preview (using Google Docs Viewer)
  const handlePreviewWordFile = (url: string, fileName: string) => {
    // Using Google Docs Viewer to preview the file
    const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
    window.open(googleDocsViewerUrl, "_blank")
  }

  if (!lesson) return null

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          py: 4,
          px: { xs: 2, sm: 4, md: 6 },
        }}
      >
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
                      סיכום מעובד
                    </Typography>
                  </Box>

                  <Box sx={{ flexGrow: 1, px: 3, pb: 3 }}>
                    {loading ? (
                      <Skeleton variant="rectangular" height={180} animation="wave" />
                    ) : processedUrl ? (
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
                        {isPdfFile(processedSummary?.fileName || "") ? (
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
                              sx={{
                                color: "#e53935",
                                fontWeight: "medium",
                                textAlign: "center",
                                px: 2,
                              }}
                            >
                              {processedSummary?.fileName}
                            </Typography>
                            <Typography color="text.secondary" variant="caption" sx={{ mt: 1 }}>
                              מסמך PDF
                            </Typography>
                          </Box>
                        ) : isWordFile(processedSummary?.fileName || "") ? (
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
                              sx={{
                                color: "#2a5699",
                                fontWeight: "medium",
                                textAlign: "center",
                                px: 2,
                              }}
                            >
                              {processedSummary?.fileName}
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
                              sx={{
                                color: "primary.main",
                                fontWeight: "medium",
                                textAlign: "center",
                                px: 2,
                              }}
                            >
                              {processedSummary?.fileName}
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
                          אין סיכום מעובד.
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {processedSummary?.filePath && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                        p: 2,
                        borderTop: "1px solid rgba(0,0,0,0.08)",
                        bgcolor: "rgba(0,0,0,0.01)",
                      }}
                    >
                      <Button
                        variant="outlined"
                        startIcon={<OpenInNewIcon />}
                        href={processedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        sx={{ borderRadius: 2 }}
                      >
                        פתח בחלון חדש
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        href={`${baseUrl}/upload/download?filePath=${processedSummary.s3Key}&fileName=${processedSummary.fileName}`}
                        size="small"
                        sx={{ borderRadius: 2 }}
                      >
                        הורד
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* סיכום מקורי */}
            <Grid item xs={12} md={4}>
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
                      סיכום מקורי
                    </Typography>
                  </Box>

                  <Box sx={{ flexGrow: 1, px: 3, pb: 3 }}>
                    {loading ? (
                      <Skeleton variant="rectangular" height={180} animation="wave" />
                    ) : originalUrl ? (
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
                        {isPdfFile(originalSummary?.fileName || "") ? (
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
                              sx={{
                                color: "#e53935",
                                fontWeight: "medium",
                                textAlign: "center",
                                px: 2,
                              }}
                            >
                              {originalSummary?.fileName}
                            </Typography>
                            <Typography color="text.secondary" variant="caption" sx={{ mt: 1 }}>
                              מסמך PDF
                            </Typography>
                          </Box>
                        ) : isWordFile(originalSummary?.fileName || "") ? (
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
                              sx={{
                                color: "#2a5699",
                                fontWeight: "medium",
                                textAlign: "center",
                                px: 2,
                              }}
                            >
                              {originalSummary?.fileName}
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
                              sx={{
                                color: "primary.main",
                                fontWeight: "medium",
                                textAlign: "center",
                                px: 2,
                              }}
                            >
                              {originalSummary?.fileName}
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
                          אין סיכום מקורי.
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {originalSummary?.filePath && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                        p: 2,
                        borderTop: "1px solid rgba(0,0,0,0.08)",
                        bgcolor: "rgba(0,0,0,0.01)",
                      }}
                    >
                      <Button
                        variant="outlined"
                        startIcon={<OpenInNewIcon />}
                        href={originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        sx={{ borderRadius: 2 }}
                      >
                        פתח בחלון חדש
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        href={`${baseUrl}/upload/download?filePath=${originalSummary.filePath}&fileName=${originalSummary.fileName}`}
                        size="small"
                        sx={{ borderRadius: 2 }}
                      >
                        הורד
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
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
                      <CardContent
                        sx={{
                          p: 0,
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <Chip
                            label={fileType}
                            size="small"
                            color={isWord ? "info" : "primary"}
                            variant="outlined"
                            sx={{
                              height: 22,
                              fontSize: "0.7rem",
                              fontWeight: "bold",
                            }}
                          />
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
                                sx={{
                                  color: "#2a5699",
                                  fontWeight: "medium",
                                  textAlign: "center",
                                  px: 2,
                                }}
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
                          {isWord && (
                            <Button
                              variant="outlined"
                              startIcon={<PreviewIcon />}
                              onClick={() => handlePreviewWordFile(previewUrl, file.fileName)}
                              sx={{
                                borderRadius: 2,
                                flex: 1,
                                borderColor: "#2a5699",
                                color: "#2a5699",
                                "&:hover": {
                                  borderColor: "#1e3c6e",
                                  backgroundColor: "rgba(42, 86, 153, 0.04)",
                                },
                              }}
                            >
                              תצוגה מקדימה
                            </Button>
                          )}
                          <Button
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            href={`${baseUrl}/upload/download?filePath=${file.s3Key}&fileName=${file.fileName}`}
                            sx={{
                              borderRadius: 2,
                              flex: 1,
                              bgcolor: isWord ? "#2a5699" : undefined,
                              "&:hover": {
                                bgcolor: isWord ? "#1e3c6e" : undefined,
                              },
                            }}
                          >
                            הורד
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          )}
        </Paper>
      </Box>
    </ThemeProvider>
  )
}

export default LessonDisplay
