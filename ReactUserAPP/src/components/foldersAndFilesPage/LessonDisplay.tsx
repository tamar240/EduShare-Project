
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import { Box, Container, Typography, Button, Stack, Chip, Snackbar, Alert } from "@mui/material"
import type { Lesson, UploadedFileData } from "../typies/types"
import { getCookie } from "../login/Login"
import { ArrowForward as ArrowForwardIcon, School as SchoolIcon } from "@mui/icons-material"
import { SummarySection } from "./SummarySectionProps"
import { FilesSection } from "./FilesSectionProps"
import PopupDialog from "../parts/PopupDialog"

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
      const res = await axios.get(`${baseUrl}/api/upload/download-url/${fileKey}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return res.data.downloadUrl
    } catch (err) {
      console.error("Error getting download URL:", err)
      showSnackbar("שגיאה בקבלת קישור הורדה", "error")
      return null
    }
  }

  const getFileTextContent = async (url: string, fileName: string): Promise<string> => {
    try {
      const textExtensions = [".txt", ".md", ".json", ".js", ".ts", ".jsx", ".tsx", ".css", ".html"]
      if (textExtensions.some(ext => fileName.toLowerCase().endsWith(ext))) {
        const response = await fetch(url)
        const text = await response.text()
        return text.substring(0, 1000)
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
    <Box sx={{ minHeight: "100vh", p: 2 }}>
      <Container maxWidth="xl">
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Button variant="outlined" startIcon={<ArrowForwardIcon />} onClick={onGoBack}>
            חזרה לרשימת השיעורים
          </Button>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="h4" sx={{ mb: 1 }}>
              {lesson.name}
            </Typography>
            <Chip icon={<SchoolIcon />} label={`שיעור מס' ${lesson.id}`} />
          </Box>
        </Stack>

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

      <PopupDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, file: null, type: "lesson" })}
        onConfirm={handleDeleteFile}
        message={`האם אתה בטוח שברצונך להעביר את הקובץ "${deleteDialog.file?.fileName}" לסל המיחזור?`}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default LessonDisplay