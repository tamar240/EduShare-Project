// "use client"

// import type React from "react"
// import { Grid, Paper, Card, CardContent, Box, Typography, Stack, IconButton, Tooltip, Skeleton } from "@mui/material"
// import {
//   Article as ArticleIcon,
//   AutoStories as AutoStoriesIcon,
//   Visibility as VisibilityIcon,
//   GetApp as GetAppIcon,
//   DeleteOutline as DeleteOutlineIcon,
//   Description as DescriptionIcon,
//   Code as CodeIcon,
// } from "@mui/icons-material"
// import type { UploadedFileData } from "../typies/types"
// import { log } from "console"

// interface SummarySectionProps {
//   originalSummary?: UploadedFileData
//   processedSummary?: UploadedFileData
//   originalUrl: string
//   processedUrl: string
//   originalContent: string
//   processedContent: string
//   loading: boolean
//   onView: (file: UploadedFileData) => void
//   onDownload: (file: UploadedFileData) => void
//   onDelete: (file: UploadedFileData, type: "original" | "processed") => void
//   deletingFiles: Set<string>
// }

// const FileContentViewer: React.FC<{
//   fileName: string
//   url: string
//   content?: string
//   height?: number
// }> = ({ fileName, url, content, height = 200 }) => {
//   const isImageFile = (name: string) =>
//     [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"].some((ext) => name.toLowerCase().endsWith(ext))

//   const isPdfFile = (name: string) => name.toLowerCase().endsWith(".pdf")

//   const isTextFile = (name: string) =>
//     [".txt", ".md", ".json", ".js", ".ts", ".jsx", ".tsx", ".css", ".html"].some((ext) =>
//       name.toLowerCase().endsWith(ext),
//     )

//   const isWordFile = (name: string) => name.toLowerCase().endsWith(".doc") || name.toLowerCase().endsWith(".docx")

//   if (isImageFile(fileName)) {
//     return (
//       <Box
//         sx={{
//           width: "100%",
//           height,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           borderRadius: 2,
//           overflow: "hidden",
//           bgcolor: "grey.50",
//           border: "1px solid",
//           borderColor: "grey.200",
//         }}
//       >
//         <img
//           src={url || "/placeholder.svg"}
//           alt={fileName}
//           style={{
//             maxWidth: "100%",
//             maxHeight: "100%",
//             objectFit: "contain",
//           }}
//         />
//       </Box>
//     )
//   }

//   if (isPdfFile(fileName)) {
//     return (
//       <Box
//         sx={{
//           width: "100%",
//           height,
//           borderRadius: 2,
//           overflow: "hidden",
//           border: "1px solid",
//           borderColor: "grey.200",
//         }}
//       >
// {/* <iframe src={url} width="100%" height="100%" style={{ border: "none" }} title={fileName} /> */}
// <iframe
//   src={url}
//   width="100%"
//   height="600px"
//   style={{ border: 'none' }}
// />


// </Box>
//     )
//   }

//   if (isTextFile(fileName) && content) {
//     return (
//       <Box
//         sx={{
//           width: "100%",
//           height,
//           borderRadius: 2,
//           border: "1px solid",
//           borderColor: "grey.200",
//           bgcolor: "#1e1e1e",
//           color: "#d4d4d4",
//           fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
//           fontSize: "0.875rem",
//           overflow: "auto",
//           position: "relative",
//         }}
//       >
//         <Box
//           sx={{
//             position: "sticky",
//             top: 0,
//             bgcolor: "#2d2d30",
//             borderBottom: "1px solid #3e3e42",
//             px: 2,
//             py: 1,
//             display: "flex",
//             alignItems: "center",
//             gap: 1,
//             zIndex: 1,
//           }}
//         >
//           <CodeIcon sx={{ fontSize: 16, color: "#569cd6" }} />
//           <Typography
//             variant="caption"
//             sx={{
//               color: "#cccccc",
//               fontWeight: 500,
//               fontFamily: '"Segoe UI", sans-serif',
//             }}
//           >
//             {fileName}
//           </Typography>
//         </Box>
//         <Box sx={{ p: 2 }}>
//           <pre
//             style={{
//               margin: 0,
//               whiteSpace: "pre-wrap",
//               wordBreak: "break-word",
//               lineHeight: 1.5,
//             }}
//           >
//             {content}
//           </pre>
//         </Box>
//       </Box>
//     )
//   }

//   if (isWordFile(fileName)) {
//     return (
//       <Box
//         sx={{
//           width: "100%",
//           height,
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           borderRadius: 2,
//           bgcolor: "#f8fafc",
//           border: "1px solid",
//           borderColor: "primary.main",
//         }}
//       >
//         <DescriptionIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
//         <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main", mb: 1 }}>
//           {fileName}
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           מסמך Word - לחץ לצפייה
//         </Typography>
//       </Box>
//     )
//   }

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         height,
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         borderRadius: 2,
//         bgcolor: "grey.50",
//         border: "1px solid",
//         borderColor: "grey.300",
//       }}
//     >
//       <DescriptionIcon sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
//       <Typography variant="body1" sx={{ fontWeight: 500, color: "grey.600", mb: 1 }}>
//         {fileName}
//       </Typography>
//       <Typography variant="body2" color="text.secondary">
//         תצוגה מקדימה לא זמינה
//       </Typography>

//     </Box>
//   )
// }

// const SummaryCard: React.FC<{
//   file?: UploadedFileData
//   title: string
//   url: string
//   content: string
//   type: "original" | "processed"
//   icon: React.ReactNode
//   loading: boolean
//   onView: (file: UploadedFileData) => void
//   onDownload: (file: UploadedFileData) => void
//   onDelete: (file: UploadedFileData) => void
//   isDeleting: boolean
// }> = ({ file, title, url, content, type, icon, loading, onView, onDownload, onDelete, isDeleting }) => {
//   return (
//     <Card
//       sx={{
//         height: "100%",
//         display: "flex",
//         flexDirection: "column",
//         bgcolor: "background.paper",
//       }}
//     >
//       <CardContent sx={{ p: 0, flexGrow: 1, display: "flex", flexDirection: "column" }}>
//         <Box
//           sx={{
//             p: 3,
//             borderBottom: "1px solid",
//             borderColor: "grey.200",
//             bgcolor: type === "processed" ? "primary.50" : "secondary.50",
//           }}
//         >
//           <Stack direction="row" alignItems="center" justifyContent="space-between">
//             <Box
//               sx={{
//                 width: 40,
//                 height: 40,
//                 borderRadius: 2,
//                 bgcolor: type === "processed" ? "primary.main" : "secondary.main",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: "white",
//               }}
//             >
//               {icon}
//             </Box>
//             <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
//               {title}
//             </Typography>
//           </Stack>
//         </Box>

//         <Box sx={{ flexGrow: 1, p: 3 }}>
//           {loading ? (
//             <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
//           ) : url && file ? (
//             <FileContentViewer fileName={file.fileName} url={url} content={content} height={300} />
//           ) : (
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 height: 300,
//                 bgcolor: "grey.50",
//                 borderRadius: 2,
//                 border: "2px dashed",
//                 borderColor: "grey.300",
//               }}
//             >
//               <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
//                 אין {type === "original" ? "סיכום מקורי" : "סיכום מעובד"}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 לא נמצא קובץ עבור סוג זה
//               </Typography>
//             </Box>
//           )}
//         </Box>

//         {file && (
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               gap: 1,
//               p: 3,
//               borderTop: "1px solid",
//               borderColor: "grey.200",
//               bgcolor: "grey.50",
//             }}
//           >
//             <Tooltip title="צפייה בקובץ">
//               <IconButton
//                 onClick={() => onView(file)}
//                 sx={{
//                   bgcolor: "primary.main",
//                   color: "white",
//                   "&:hover": { bgcolor: "primary.dark" },
//                 }}
//               >
//                 <VisibilityIcon />
//               </IconButton>
//             </Tooltip>

//             <Tooltip title="הורדת קובץ">
//               <IconButton
//                 onClick={() => onDownload(file)}
//                 sx={{
//                   bgcolor: "success.main",
//                   color: "white",
//                   "&:hover": { bgcolor: "success.dark" },
//                 }}
//               >
//                 <GetAppIcon />
//               </IconButton>
//             </Tooltip>

//             <Tooltip title="מחיקת קובץ">
//               <IconButton
//                 onClick={() => onDelete(file)}
//                 disabled={isDeleting}
//                 sx={{
//                   bgcolor: "error.main",
//                   color: "white",
//                   "&:hover": { bgcolor: "error.dark" },
//                   "&:disabled": { bgcolor: "grey.300" },
//                 }}
//               >
//                 <DeleteOutlineIcon />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         )}
//       </CardContent>
//     </Card>
//   )
// }

// export const SummarySection: React.FC<SummarySectionProps> = ({
//   originalSummary,
//   processedSummary,
//   originalUrl,
//   processedUrl,
//   originalContent,
//   processedContent,
//   loading,
//   onView,
//   onDownload,
//   onDelete,
//   deletingFiles,
// }) => {
//   return (
//     <Paper
//       elevation={0}
//       sx={{
//         p: { xs: 3, sm: 4 },
//         mb: 4,
//         bgcolor: "background.paper",
//       }}
//     >
//       <Grid container spacing={4} direction="row-reverse">
//         <Grid item xs={12} lg={8}>
//           <SummaryCard
//             file={processedSummary}
//             title="סיכום מעובד"
//             url={processedUrl}
//             content={processedContent}
//             type="processed"
//             icon={<AutoStoriesIcon />}
//             loading={loading}
//             onView={onView}
//             onDownload={onDownload}
//             onDelete={(file) => onDelete(file, "processed")}
//             isDeleting={processedSummary ? deletingFiles.has(processedSummary.id.toString()) : false}
//           />
//         </Grid>

//         <Grid item xs={12} lg={4}>
//           <SummaryCard
//             file={originalSummary}
//             title="סיכום מקורי"
//             url={originalUrl}
//             content={originalContent}
//             type="original"
//             icon={<ArticleIcon />}
//             loading={loading}
//             onView={onView}
//             onDownload={onDownload}
//             onDelete={(file) => onDelete(file, "original")}
//             isDeleting={originalSummary ? deletingFiles.has(originalSummary.id.toString()) : false}
//           />
//         </Grid>
//       </Grid>
//     </Paper>
//   )
// }
"use client"

import React from "react"

import type { ReactElement } from "react"
import {
  Grid,
  Paper,
  Card,
  CardContent,
  Box,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Skeleton,
  Button,
} from "@mui/material"
import {
  Article as ArticleIcon,
  AutoStories as AutoStoriesIcon,
  Visibility as VisibilityIcon,
  GetApp as GetAppIcon,
  DeleteOutline as DeleteOutlineIcon,
  Description as DescriptionIcon,
  Code as CodeIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material"
import type { UploadedFileData } from "../typies/types"

interface SummarySectionProps {
  originalSummary?: UploadedFileData
  processedSummary?: UploadedFileData
  originalUrl: string
  processedUrl: string
  originalContent: string
  processedContent: string
  loading: boolean
  onView: (file: UploadedFileData) => void
  onDownload: (file: UploadedFileData) => void
  onDelete: (file: UploadedFileData, type: "original" | "processed") => void
  deletingFiles: Set<string>
}

const FileContentViewer: React.FC<{
  fileName: string
  url: string
  content?: string
  height?: number
}> = ({ fileName, url, content, height = 200 }) => {
  const [fileUrl, setFileUrl] = React.useState<string>("")
  const [isLoading, setIsLoading] = React.useState(false)
  
  const [error, setError] = React.useState<string>("")

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
    if (!url) {
      setError("כתובת URL לא מוגדרת")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      console.log("Downloading file for preview from:", url)

      // Import axios dynamically
      const axios = (await import("axios")).default

      const fileResponse = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: 30000,
      })

      const fileExtension = fileName.split(".").pop()?.toLowerCase() || ""

      const blobUrl = window.URL.createObjectURL(
        new Blob([fileResponse.data], {
          type: getMimeType(fileExtension),
        }),
      )

      setFileUrl(blobUrl)
    } catch (error: any) {
      console.error("Error downloading for preview:", error)
      setError(`שגיאה בטעינת הקובץ: ${error.message || "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Load file when component mounts or URL changes
  React.useEffect(() => {
    if (url && (isPdfFile(fileName) || isWordFile(fileName) || isImageFile(fileName))) {
      downloadAndCreateBlobUrl()
    }

    // Cleanup blob URL when component unmounts
    return () => {
      if (fileUrl) {
        window.URL.revokeObjectURL(fileUrl)
      }
    }
  }, [url, fileName])

  if (isLoading) {
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
          borderColor: "grey.200",
        }}
      >
        <Skeleton variant="rectangular" width="80%" height="60%" sx={{ borderRadius: 1, mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          טוען קובץ...
        </Typography>
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
          bgcolor: "error.50",
          border: "1px solid",
          borderColor: "error.200",
        }}
      >
        <DescriptionIcon sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
        <Typography variant="body1" sx={{ fontWeight: 500, color: "error.main", mb: 1, textAlign: "center" }}>
          שגיאה בטעינת הקובץ
        </Typography>
        <Typography variant="body2" color="error.main" sx={{ textAlign: "center", mb: 2 }}>
          {error}
        </Typography>
        <Button variant="outlined" color="error" onClick={downloadAndCreateBlobUrl}>
          נסה שוב
        </Button>
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
          src={fileUrl || url || "/placeholder.svg"}
          alt={fileName}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
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

        {/* PDF Controls */}
        <Box
          sx={{
            p: 2,
            bgcolor: "grey.100",
            borderTop: "1px solid",
            borderColor: "grey.200",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {fileName}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Tooltip title="פתח בחלון חדש">
              <IconButton size="small" onClick={() => window.open(fileUrl, "_blank")}>
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="הורד קובץ">
              <IconButton
                size="small"
                onClick={() => {
                  const link = document.createElement("a")
                  link.href = fileUrl
                  link.download = fileName
                  link.click()
                }}
              >
                <GetAppIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
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
        onClick={() => window.open(fileUrl || url, "_blank")}
      >
        <DescriptionIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main", mb: 1 }}>
          {fileName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          מסמך Word - לחץ לצפייה
        </Typography>
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
          fontSize: "0.875rem",
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
          <CodeIcon sx={{ fontSize: 16, color: "#569cd6" }} />
          <Typography
            variant="caption"
            sx={{
              color: "#cccccc",
              fontWeight: 500,
              fontFamily: '"Segoe UI", sans-serif',
            }}
          >
            {fileName}
          </Typography>
        </Box>
        <Box sx={{ p: 2 }}>
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              lineHeight: 1.5,
            }}
          >
            {content}
          </pre>
        </Box>
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
      <DescriptionIcon sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
      <Typography variant="body1" sx={{ fontWeight: 500, color: "grey.600", mb: 1 }}>
        {fileName}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        תצוגה מקדימה לא זמינה
      </Typography>
    </Box>
  )
}

const SummaryCard: React.FC<{
  file?: UploadedFileData
  title: string
  url: string
  content: string
  type: "original" | "processed"
  icon: ReactElement
  loading: boolean
  onView: (file: UploadedFileData) => void
  onDownload: (file: UploadedFileData) => void
  onDelete: (file: UploadedFileData) => void
  isDeleting: boolean
}> = ({ file, title, url, content, type, icon, loading, onView, onDownload, onDelete, isDeleting }) => {
  return (
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
            bgcolor: type === "processed" ? "primary.50" : "secondary.50",
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: type === "processed" ? "primary.main" : "secondary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              {icon}
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
              {title}
            </Typography>
          </Stack>
        </Box>

        <Box sx={{ flexGrow: 1, p: 3 }}>
          {loading ? (
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          ) : url && file ? (
            <FileContentViewer fileName={file.fileName} url={url} content={content} height={300} />
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: 300,
                bgcolor: "grey.50",
                borderRadius: 2,
                border: "2px dashed",
                borderColor: "grey.300",
              }}
            >
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                אין {type === "original" ? "סיכום מקורי" : "סיכום מעובד"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                לא נמצא קובץ עבור סוג זה
              </Typography>
            </Box>
          )}
        </Box>

        {file && (
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
                onClick={() => onView(file)}
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
                onClick={() => onDownload(file)}
                sx={{
                  bgcolor: "success.main",
                  color: "white",
                  "&:hover": { bgcolor: "success.dark" },
                }}
              >
                <GetAppIcon />
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
                <DeleteOutlineIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  originalSummary,
  processedSummary,
  originalUrl,
  processedUrl,
  originalContent,
  processedContent,
  loading,
  onView,
  onDownload,
  onDelete,
  deletingFiles,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, sm: 4 },
        mb: 4,
        bgcolor: "background.paper",
      }}
    >
      <Grid container spacing={4} direction="row-reverse">
        <Grid item xs={12} lg={8}>
          <SummaryCard
            file={processedSummary}
            title="סיכום מעובד"
            url={processedUrl}
            content={processedContent}
            type="processed"
            icon={<AutoStoriesIcon />}
            loading={loading}
            onView={onView}
            onDownload={onDownload}
            onDelete={(file) => onDelete(file, "processed")}
            isDeleting={processedSummary ? deletingFiles.has(processedSummary.id.toString()) : false}
          />
        </Grid>

        <Grid item xs={12} lg={4}>
          <SummaryCard
            file={originalSummary}
            title="סיכום מקורי"
            url={originalUrl}
            content={originalContent}
            type="original"
            icon={<ArticleIcon />}
            loading={loading}
            onView={onView}
            onDownload={onDownload}
            onDelete={(file) => onDelete(file, "original")}
            isDeleting={originalSummary ? deletingFiles.has(originalSummary.id.toString()) : false}
          />
        </Grid>
      </Grid>
    </Paper>
  )
}
