"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import {
  Box,
  Container,
  ThemeProvider,
  createTheme,
  Typography,
  Button,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material"
import type { Lesson, UploadedFileData } from "../typies/types"
import { getCookie } from "../login/Login"
import {
  ArrowForward as ArrowForwardIcon,
  School as SchoolIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material"
import { SummarySection } from "./SummarySectionProps"
import { FilesSection } from "./FilesSectionProps"


// Professional theme for teachers
const professionalTheme = createTheme({
  direction: "rtl",
  palette: {
    mode: "light",
    primary: {
      main: "#1a365d",
      light: "#2d5a87",
      dark: "#0f2a44",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#2c5282",
      light: "#4299e1",
      dark: "#1a365d",
    },
    error: {
      main: "#c53030",
      light: "#e53e3e",
      dark: "#9b2c2c",
    },
    warning: {
      main: "#d69e2e",
      light: "#f6e05e",
      dark: "#b7791f",
    },
    success: {
      main: "#38a169",
      light: "#48bb78",
      dark: "#2f855a",
    },
    background: {
      default: "#f7fafc",
      paper: "#ffffff",
    },
    grey: {
      50: "#f7fafc",
      100: "#edf2f7",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#a0aec0",
      500: "#718096",
      600: "#4a5568",
      700: "#2d3748",
      800: "#1a202c",
      900: "#171923",
    },
    text: {
      primary: "#1a202c",
      secondary: "#4a5568",
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
      color: "#1a202c",
    },
    h5: {
      fontWeight: 600,
      letterSpacing: "-0.025em",
      color: "#2d3748",
    },
    h6: {
      fontWeight: 600,
      letterSpacing: "-0.025em",
      color: "#2d3748",
    },
    subtitle1: {
      fontWeight: 500,
      color: "#4a5568",
    },
    body1: {
      lineHeight: 1.6,
      color: "#4a5568",
    },
    body2: {
      lineHeight: 1.5,
      color: "#718096",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            borderColor: "#cbd5e1",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.875rem",
          padding: "8px 16px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
        },
        contained: {
          backgroundColor: "#1a365d",
          "&:hover": {
            backgroundColor: "#2d5a87",
          },
        },
        outlined: {
          borderColor: "#cbd5e1",
          color: "#4a5568",
          "&:hover": {
            borderColor: "#1a365d",
            backgroundColor: "rgba(26, 54, 93, 0.04)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid #e2e8f0",
        },
      },
    },
  },
})

interface LessonDisplayProps {
  lesson: Lesson
  subjectId: number
  onGoBack: () => void
}

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

const LessonDisplay: React.FC<LessonDisplayProps> = ({ lesson, onGoBack }) => {
  const token = getCookie("auth_token")
  const baseUrl = import.meta.env.VITE_API_URL

  // State
  const [lessonFiles, setLessonFiles] = useState<UploadedFileData[]>([])
  const [originalSummary, setOriginalSummary] = useState<UploadedFileData>()
  const [processedSummary, setProcessedSummary] = useState<UploadedFileData>()
  const [originalUrl, setOriginalUrl] = useState<string>("")
  const [processedUrl, setProcessedUrl] = useState<string>("")
  const [originalContent, setOriginalContent] = useState<string>("")
  const [processedContent, setProcessedContent] = useState<string>("")
  const [filePreviews, setFilePreviews] = useState<{ [key: string]: string }>({})
  const [fileContents, setFileContents] = useState<{ [key: string]: string }>({})
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
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set())

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

  const getDownloadUrl = async (fileKey: string): Promise<string | null> => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/upload/download-url/${encodeURIComponent(fileKey)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.downloadUrl;
      
      return res.data.downloadUrl;
      
    } catch (err) {
      console.error("Error getting download URL:", err)
      showSnackbar("שגיאה בקבלת קישור הורדה", "error")
      return null
    }
  }

  const getFileTextContent = async (url: string, fileName: string): Promise<string> => {
    try {
      if (
        fileName.toLowerCase().endsWith(".txt") ||
        fileName.toLowerCase().endsWith(".md") ||
        fileName.toLowerCase().endsWith(".json") ||
        fileName.toLowerCase().endsWith(".js") ||
        fileName.toLowerCase().endsWith(".ts") ||
        fileName.toLowerCase().endsWith(".jsx") ||
        fileName.toLowerCase().endsWith(".tsx") ||
        fileName.toLowerCase().endsWith(".css") ||
        fileName.toLowerCase().endsWith(".html")
      ) {
        const response = await fetch(url)
        const text = await response.text()
        return text.substring(0, 1000) // First 1000 characters
      }
      return ""
    } catch (err) {
      console.error("Error getting file text content:", err)
      return ""
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

  const handleViewFile = async (file: UploadedFileData) => {
    const url = await getPresignedUrl(file.s3Key)
    if (url) {
      if (file.fileName.toLowerCase().endsWith(".doc") || file.fileName.toLowerCase().endsWith(".docx")) {
        const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
        window.open(googleDocsViewerUrl, "_blank", "width=1200,height=800,scrollbars=yes,resizable=yes")
      } else {
        window.open(url, "_blank")
      }
    }
  }

  const handleDownloadFile = async (file: UploadedFileData) => {
    try {
      const downloadUrl = await getDownloadUrl(file.s3Key)

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
      if (lesson?.orginalSummaryId) {
        const res = await axios.get(`${baseUrl}/api/UploadedFile/id/${lesson.orginalSummaryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const original = res.data
        setOriginalSummary(original)
        const url = await getPresignedUrl(original.s3Key)
        if (url) {
          setOriginalUrl(url)
          const content = await getFileTextContent(url, original.fileName)
          setOriginalContent(content)
        }
      }

      if (lesson?.processedSummaryId) {
        const res = await axios.get(`${baseUrl}/api/UploadedFile/id/${lesson.processedSummaryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const processed = res.data
        setProcessedSummary(processed)
        const url = await getPresignedUrl(processed.filePath)
        if (url) {
          setProcessedUrl(url)
          const content = await getFileTextContent(url, processed.fileName)
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
      const contents: { [key: string]: string } = {}

      for (const file of lessonFiles) {
        if (file.s3Key) {
          const url = await getPresignedUrl(file.s3Key)
          if (url) {
            previews[file.s3Key] = url
            const textContent = await getFileTextContent(url, file.fileName)
            if (textContent) {
              contents[file.s3Key] = textContent
            }
          }
        }
      }
      setFilePreviews(previews)
      setFileContents(contents)
    }

    if (lessonFiles.length > 0) fetchPreviewUrls()
  }, [lessonFiles])

  return (
    <ThemeProvider theme={professionalTheme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 4 } }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
              spacing={3}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                    fontSize: { xs: "1.75rem", sm: "2.125rem" },
                    mb: 2,
                  }}
                >
                  {lesson.name}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Chip
                    icon={<SchoolIcon />}
                    label={`שיעור מס' ${lesson.id}`}
                    variant="outlined"
                    sx={{
                      borderColor: "primary.main",
                      color: "primary.main",
                      fontWeight: 500,
                    }}
                  />
                </Stack>
              </Box>

              <Button
                variant="outlined"
                startIcon={<ArrowForwardIcon />}
                onClick={onGoBack}
                sx={{
                  px: 3,
                  py: 1.5,
                  alignSelf: { xs: "flex-start", sm: "center" },
                }}
              >
                חזרה לרשימת השיעורים
              </Button>
            </Stack>
          </Box>

          {/* Summary Section */}
          <SummarySection
            originalSummary={originalSummary}
            processedSummary={processedSummary}
            originalUrl={originalUrl}
            processedUrl={processedUrl}
            originalContent={originalContent}
            processedContent={processedContent}
            loading={loading}
            onView={handleViewFile}
            onDownload={handleDownloadFile}
            onDelete={(file: any, type: any) => setDeleteDialog({ open: true, file, type })}
            deletingFiles={deletingFiles}
          />

          {/* Files Section */}
          <FilesSection
            files={lessonFiles}
            filePreviews={filePreviews}
            fileContents={fileContents}
            loading={loading}
            onView={handleViewFile}
            onDownload={handleDownloadFile}
            onDelete={(file: any) => setDeleteDialog({ open: true, file, type: "lesson" })}
            deletingFiles={deletingFiles}
          />
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
              fontWeight: 600,
              fontSize: "1.25rem",
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: "error.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <WarningIcon />
            </Box>
            אישור מחיקה
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <DialogContentText
              sx={{
                textAlign: "right",
                fontSize: "1.1rem",
                color: "text.primary",
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
              disabled={deleteDialog.file ? deletingFiles.has(deleteDialog.file.id.toString()) : false}
            >
              ביטול
            </Button>
            <Button
              onClick={handleDeleteFile}
              variant="contained"
              color="error"
              startIcon={
                deleteDialog.file && deletingFiles.has(deleteDialog.file.id.toString()) ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <DeleteIcon />
                )
              }
              disabled={deleteDialog.file ? deletingFiles.has(deleteDialog.file.id.toString()) : false}
              sx={{ borderRadius: 2, px: 3 }}
            >
              {deleteDialog.file && deletingFiles.has(deleteDialog.file.id.toString()) ? "מוחק..." : "מחק"}
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
