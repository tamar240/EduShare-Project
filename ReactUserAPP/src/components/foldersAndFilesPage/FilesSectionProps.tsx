
"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Tooltip,
  Fade,
} from "@mui/material"
import {
  Folder as FolderIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  GetApp as GetAppIcon,
  DeleteOutline as DeleteOutlineIcon,
  Description as DescriptionIcon,
  Code as CodeIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material"
import type { UploadedFileData } from "../typies/types"
import { getCookie } from "../login/Login"


export interface FilesSectionProps {
  files: UploadedFileData[];
  filePreviews: { [key: string]: string };
  fileContents: { [key: string]: string };
  loading: boolean;
  onView: (file: UploadedFileData) => Promise<void>;
  onDownload: (file: UploadedFileData) => Promise<void>;
  onDelete: (file: any) => void;
  deletingFiles: Set<string>;
}
const getViewUrl = async (s3Key: string): Promise<string> => {
  try {
    const token = getCookie("auth_token")
    if (!token) {
      throw new Error("No authentication token found")
    }

    // Import axios dynamically
    const axios = (await import("axios")).default

    const response = await axios.get(
      `https://edushare-api.onrender.com/api/upload/presigned-url/view?filePath=${encodeURIComponent(s3Key)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    )

    return response.data.url || response.data.presignedUrl || response.data
  } catch (error) {
    console.error("Error getting view URL:", error)
    throw error
  }
}

const getDownloadUrl = async (s3Key: string): Promise<string> => {
  try {
    const token = getCookie("auth_token")
    if (!token) {
      throw new Error("No authentication token found")
    }

    console.log("Requesting download URL for S3 key:", s3Key)

    // Import axios dynamically
    const axios = (await import("axios")).default

    // שליחת המחרוזת ישירות כפי שהשרת מצפה
    const response = await axios.post(
      "https://edushare-api.onrender.com/api/upload/download-url",
      s3Key, // שליחת המחרוזת ישירות!
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    )

    console.log("Download URL response:", response.data)

    const downloadUrl =
      response.data.url ||
      response.data.downloadUrl ||
      response.data.presignedUrl ||
      response.data.signedUrl ||
      response.data

    if (!downloadUrl || typeof downloadUrl !== "string") {
      console.error("Invalid download URL response:", response.data)
      throw new Error("Invalid download URL received from server")
    }

    return downloadUrl
  } catch (error: any) {
    console.error("Error getting download URL:", error)
    if (error.response) {
      console.error("Response status:", error.response.status)
      console.error("Response data:", error.response.data)
      throw new Error(`Failed to get download URL: ${error.response.status} - ${JSON.stringify(error.response.data)}`)
    }
    throw error
  }
}

const FileContentViewer: React.FC<{
  fileName: string
  file: UploadedFileData
  content?: string
  height?: number
}> = ({ fileName, file, content, height = 180 }) => {
  const [fileUrl, setFileUrl] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  const isImageFile = (name: string) =>
    [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"].some((ext) => name.toLowerCase().endsWith(ext))

  const isPdfFile = (name: string) => name.toLowerCase().endsWith(".pdf")

  const isTextFile = (name: string) =>
    [".txt", ".md", ".json", ".js", ".ts", ".jsx", ".tsx", ".css", ".html"].some((ext) =>
      name.toLowerCase().endsWith(ext),
    )

  const isWordFile = (name: string) => name.toLowerCase().endsWith(".doc") || name.toLowerCase().endsWith(".docx")

  const getMimeType = (fileType: string) => {
    const mimeTypes: { [key: string]: string } = {
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      bmp: "image/bmp",
      webp: "image/webp",
      txt: "text/plain",
      md: "text/markdown",
      json: "application/json",
      js: "text/javascript",
      ts: "text/typescript",
      jsx: "text/javascript",
      tsx: "text/typescript",
      css: "text/css",
      html: "text/html",
    }

    const extension = fileType.toLowerCase().replace(".", "")
    return mimeTypes[extension] || "application/octet-stream"
  }

  const downloadAndCreateBlobUrl = async () => {
    if (!file.s3Key) {
      setError("No S3 key available")
      return
    }

    try {
      setLoading(true)
      setError("")

      const url = await getViewUrl(file.s3Key)

      // Import axios dynamically
      const axios = (await import("axios")).default

      const response = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: 30000,
      })

      const fileExtension = fileName.split(".").pop()?.toLowerCase() || ""

      const blobUrl = window.URL.createObjectURL(
        new Blob([response.data], {
          type: getMimeType(fileExtension),
        }),
      )

      setFileUrl(blobUrl)
    } catch (error: any) {
      console.error("Error downloading for preview:", error)
      setError(`שגיאה בטעינת הקובץ: ${error.message || "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (file.s3Key && (isPdfFile(fileName) || isWordFile(fileName) || isImageFile(fileName))) {
      downloadAndCreateBlobUrl()
    } else {
      setLoading(false)
    }

    return () => {
      if (fileUrl) {
        window.URL.revokeObjectURL(fileUrl)
      }
    }
  }, [file.s3Key, fileName])

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          height,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 2,
          bgcolor: "grey.50",
          border: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          width: "100%",
          height,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 2,
          bgcolor: "grey.50",
          border: "1px solid",
          borderColor: "grey.300",
        }}
      >
        <DescriptionIcon sx={{ fontSize: 40, color: "grey.400", mb: 1 }} />
        <Typography variant="body2" sx={{ fontWeight: 500, color: "grey.600", mb: 0.5, textAlign: "center" }}>
          {fileName.length > 20 ? `${fileName.substring(0, 20)}...` : fileName}
        </Typography>
        <Typography variant="caption" color="error.main">
          {error}
        </Typography>
      </Box>
    )
  }

  if (isImageFile(fileName)) {
    return (
      <Box
        sx={{
          width: "100%",
          height,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "grey.50",
          border: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <img
          src={fileUrl || "/placeholder.svg"}
          alt={fileName}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
          onError={(e) => {
            console.error("Image failed to load:", fileUrl)
            e.currentTarget.src = "/placeholder.svg"
          }}
        />
      </Box>
    )
  }

  if (isPdfFile(fileName)) {
    return (
      <Box
        sx={{
          width: "100%",
          height,
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "grey.200",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ position: "relative", flexGrow: 1 }}>
          <iframe src={fileUrl} width="100%" height="100%" style={{ border: "none" }} title={fileName} />
        </Box>

        <Box
          sx={{
            p: 1,
            bgcolor: "grey.100",
            borderTop: "1px solid",
            borderColor: "grey.200",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {fileName}
          </Typography>
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="פתח בחלון חדש">
              <IconButton size="small" onClick={() => window.open(fileUrl, "_blank")}>
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Box>
    )
  }

  if (isTextFile(fileName) && content) {
    return (
      <Box
        sx={{
          width: "100%",
          height,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "grey.200",
          bgcolor: "#1e1e1e",
          color: "#d4d4d4",
          fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
          fontSize: "0.75rem",
          overflow: "auto",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            bgcolor: "#2d2d30",
            borderBottom: "1px solid #3e3e42",
            px: 2,
            py: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            zIndex: 1,
          }}
        >
          <CodeIcon sx={{ fontSize: 14, color: "#569cd6" }} />
          <Typography
            variant="caption"
            sx={{
              color: "#cccccc",
              fontWeight: 500,
              fontFamily: '"Segoe UI", sans-serif',
              fontSize: "0.7rem",
            }}
          >
            {fileName}
          </Typography>
        </Box>
        <Box sx={{ p: 1.5 }}>
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              lineHeight: 1.4,
            }}
          >
            {content}
          </pre>
        </Box>
      </Box>
    )
  }

  if (isWordFile(fileName)) {
    return (
      <Box
        sx={{
          width: "100%",
          height,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 2,
          bgcolor: "#f8fafc",
          border: "1px solid",
          borderColor: "primary.main",
          cursor: "pointer",
        }}
        onClick={() => window.open(fileUrl, "_blank")}
      >
        <DescriptionIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
        <Typography variant="body2" sx={{ fontWeight: 600, color: "primary.main", mb: 0.5, textAlign: "center" }}>
          {fileName.length > 20 ? `${fileName.substring(0, 20)}...` : fileName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          מסמך Word - לחץ לצפייה
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width: "100%",
        height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 2,
        bgcolor: "grey.50",
        border: "1px solid",
        borderColor: "grey.300",
      }}
    >
      <DescriptionIcon sx={{ fontSize: 40, color: "grey.400", mb: 1 }} />
      <Typography variant="body2" sx={{ fontWeight: 500, color: "grey.600", mb: 0.5, textAlign: "center" }}>
        {fileName.length > 20 ? `${fileName.substring(0, 20)}...` : fileName}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        תצוגה מקדימה לא זמינה
      </Typography>
    </Box>
  )
}

const FileCard: React.FC<{
  file: UploadedFileData
  content: string
  onView: (file: UploadedFileData) => void
  onDelete: (file: UploadedFileData) => void
  isDeleting: boolean
}> = ({ file, content, onView, onDelete, isDeleting }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [downloading, setDownloading] = useState(false)

  const getFileTypeLabel = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toUpperCase() || ""
    return extension
  }

  const getFileTypeColor = (fileName: string) => {
    const ext = fileName.toLowerCase()
    if (ext.endsWith(".pdf")) return "error"
    if (ext.endsWith(".doc") || ext.endsWith(".docx")) return "primary"
    if (ext.endsWith(".jpg") || ext.endsWith(".jpeg") || ext.endsWith(".png")) return "success"
    if (ext.endsWith(".txt") || ext.endsWith(".md")) return "info"
    return "default"
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleDownload = useCallback(async () => {
    if (!file.s3Key) {
      console.error("No S3 key available for download")
      alert("שגיאה: לא נמצא מזהה קובץ")
      return
    }

    try {
      setDownloading(true)
      console.log("Starting download for file:", file.fileName, "S3 key:", file.s3Key)

      const downloadUrl = await getDownloadUrl(file.s3Key)
      console.log("Got download URL:", downloadUrl)

      // יצירת קישור זמני והפעלת הורדה
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = file.fileName
      link.target = "_blank"
      link.rel = "noopener noreferrer"

      // הוספה לדום, לחיצה והסרה
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      console.log("Download initiated successfully")
      alert("ההורדה החלה בהצלחה! 🎉")
    } catch (error) {
      console.error("Error downloading file:", error)
      const errorMessage = error instanceof Error ? error.message : "שגיאה לא ידועה"
      alert(`שגיאה בהורדת הקובץ: ${errorMessage}`)
    } finally {
      setDownloading(false)
    }
  }, [file.s3Key, file.fileName])

  const handleView = useCallback(async () => {
    if (!file.s3Key) {
      console.error("No S3 key available for viewing")
      return
    }

    try {
      const viewUrl = await getViewUrl(file.s3Key)
      window.open(viewUrl, "_blank", "noopener,noreferrer")
    } catch (error) {
      console.error("Error getting view URL:", error)
      onView(file)
    }
  }, [file.s3Key, file, onView])

  return (
    <Fade in timeout={300}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.paper",
        }}
      >
        <CardContent sx={{ p: 0, flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              p: 3,
              borderBottom: "1px solid",
              borderColor: "grey.200",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label={getFileTypeLabel(file.fileName)}
                size="small"
                color={getFileTypeColor(file.fileName) as any}
                variant="outlined"
                sx={{ fontWeight: 600, fontSize: "0.75rem" }}
              />
              <IconButton
                size="small"
                onClick={handleMenuClick}
                sx={{
                  bgcolor: "grey.100",
                  "&:hover": { bgcolor: "grey.200" },
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>

            <Typography
              variant="subtitle1"
              fontWeight={600}
              align="right"
              sx={{
                fontSize: "0.875rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "70%",
                color: "primary.main",
              }}
            >
              {file.fileName}
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, p: 3 }}>
            <FileContentViewer fileName={file.fileName} file={file} content={content} height={180} />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1,
              p: 3,
              borderTop: "1px solid",
              borderColor: "grey.200",
              bgcolor: "grey.50",
            }}
          >
            <Tooltip title="צפייה בקובץ">
              <IconButton
                onClick={handleView}
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="הורדת קובץ">
              <IconButton
                onClick={handleDownload}
                disabled={downloading}
                sx={{
                  bgcolor: "success.main",
                  color: "white",
                  "&:hover": { bgcolor: "success.dark" },
                  "&:disabled": { bgcolor: "grey.300" },
                }}
              >
                {downloading ? <CircularProgress size={20} color="inherit" /> : <GetAppIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="מחיקת קובץ">
              <IconButton
                onClick={() => onDelete(file)}
                disabled={isDeleting}
                sx={{
                  bgcolor: "error.main",
                  color: "white",
                  "&:hover": { bgcolor: "error.dark" },
                  "&:disabled": { bgcolor: "grey.300" },
                }}
              >
                {isDeleting ? <CircularProgress size={20} color="inherit" /> : <DeleteOutlineIcon />}
              </IconButton>
            </Tooltip>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              sx: { borderRadius: 2, minWidth: 160 },
            }}
          >
            <MenuItem
              onClick={() => {
                handleView()
                handleMenuClose()
              }}
            >
              <ListItemIcon>
                <VisibilityIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>צפייה</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleDownload()
                handleMenuClose()
              }}
            >
              <ListItemIcon>
                <GetAppIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>הורדה</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                onDelete(file)
                handleMenuClose()
              }}
              sx={{ color: "error.main" }}
            >
              <ListItemIcon>
                <DeleteOutlineIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>מחיקה</ListItemText>
            </MenuItem>
          </Menu>
        </CardContent>
      </Card>
    </Fade>
  )
}

export const FilesSection: React.FC<FilesSectionProps> = ({
  files,
  fileContents,
  loading,
  onView,
  onDelete,
  deletingFiles,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, sm: 4 },
        bgcolor: "background.paper",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <FolderIcon />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 600, color: "primary.main" }}>
          חומרי עזר נוספים ({files.length})
        </Typography>
      </Stack>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress size={48} />
        </Box>
      ) : files.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            py: 8,
            bgcolor: "grey.50",
            borderRadius: 2,
            border: "2px dashed",
            borderColor: "grey.300",
          }}
        >
          <FolderIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" color="primary.main" sx={{ mb: 1 }}>
            אין קבצים נוספים
          </Typography>
          <Typography variant="body2" color="text.secondary">
            לא נמצאו חומרי עזר נוספים לשיעור זה
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} direction="row-reverse">
          {files.map((file) => (
            <Grid item xs={12} sm={6} md={4} xl={3} key={file.id}>
              <FileCard
                file={file}
                content={fileContents[file.s3Key] || ""}
                onView={onView}
                onDelete={onDelete}
                isDeleting={deletingFiles.has(file.id.toString())}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  )
}
