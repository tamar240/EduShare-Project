
"use client"

import type React from "react"
import { useState, useRef, type MouseEvent } from "react"
import { Box, Typography, IconButton, TextField, Menu, Tooltip, MenuItem, Card, Chip, Fade } from "@mui/material"
import {
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
  Key as KeyIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material"
import PopupDialog from "../parts/PopupDialog"
import type { Lesson } from "../typies/types"
import axios from "axios"
import { getCookie } from "../login/Login"

interface PermissionLabel {
  label: string
  color: string
}

const PERMISSION_LABELS: Record<number, PermissionLabel> = {
  0: { label: "פרטי", color: "#d32f2f" },
  1: { label: "ציבורי", color: "#388e3c" },
}

interface LessonItemProps {
  lesson: Lesson
  onDelete: (lessonId: number) => Promise<void>
  onUpdate: (updatedLesson: Lesson) => void
  onPermissionChange: (lessonId: number, newPermission: number) => Promise<void>
  onLessonClick: (lesson: Lesson) => void
  type: "PUBLIC" | "PERSONAL"
}

const LessonItem = ({ lesson, onDelete, onUpdate, onPermissionChange, onLessonClick, type }: LessonItemProps) => {
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null)
  const [lessonName, setLessonName] = useState<string>(lesson.name)
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false)
  const [confirmPermissionDialogOpen, setConfirmPermissionDialogOpen] = useState<boolean>(false)
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState<boolean>(false)

  const lastClickTimeRef = useRef<number>(0)
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const DOUBLE_CLICK_DELAY = 250
  const baseUrl = import.meta.env.VITE_API_URL

  const truncateName = (name: string, maxLength = 25) => {
    if (name.length <= maxLength) return name
    return name.substring(0, maxLength) + "..."
  }

  const handleClick = (event: React.MouseEvent) => {
    if (
      (event.target as HTMLElement).tagName === "BUTTON" ||
      (event.target as HTMLElement).closest("button") ||
      (event.target as HTMLElement).tagName === "INPUT" ||
      (event.target as HTMLElement).closest("input")
    ) {
      return
    }

    const now = Date.now()
    const timeSinceLastClick = now - lastClickTimeRef.current

    if (timeSinceLastClick < DOUBLE_CLICK_DELAY) {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
        clickTimeoutRef.current = null
      }
      lastClickTimeRef.current = 0
      if (type === "PERSONAL") {
        setEditingLessonId(lesson.id)
      }
    } else {
      lastClickTimeRef.current = now
      clickTimeoutRef.current = setTimeout(() => {
        onLessonClick(lesson)
        clickTimeoutRef.current = null
      }, DOUBLE_CLICK_DELAY)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLessonName(event.target.value)
  }

  const handleBlur = async () => {
    if (lessonName.trim() !== "" && lessonName !== lesson.name) {
      const updatedLesson = {
        name: lessonName,
        subjectId: lesson.subjectId,
        ownerId: lesson.ownerId,
        permission: lesson.permission,
      }

      const token = getCookie("auth_token")

      if (token) {
        try {
          const response = await axios.put(`${baseUrl}/api/Lesson/${lesson.id}`, updatedLesson, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.status >= 200 && response.status < 300) {
            onUpdate({ ...lesson, name: lessonName })
          }
        } catch (error) {
          console.error("Error updating lesson:", error)
        }
      } else {
        console.error("No token found")
      }
    }
    setEditingLessonId(null)
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleBlur()
    }
  }

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setMenuAnchor(event.currentTarget)

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current)
      clickTimeoutRef.current = null
      lastClickTimeRef.current = 0
    }
  }

  const handleMenuClose = (event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation()
    }
    setMenuAnchor(null)
    setTooltipOpen(false)
    lastClickTimeRef.current = 0
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current)
      clickTimeoutRef.current = null
    }
  }

  const handleDetailsClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    onLessonClick(lesson)
    handleMenuClose(event)
  }

  const handlePermissionChange = (event: React.MouseEvent) => {
    event.stopPropagation()
    setConfirmPermissionDialogOpen(true)
    handleMenuClose(event)
  }

  const confirmPermissionChange = async () => {
    try {
      const newPermission = lesson.permission === 0 ? 1 : 0
      await onPermissionChange(lesson.id, newPermission)
    } catch (error) {
      console.error("Error changing permission:", error)
    } finally {
      setConfirmPermissionDialogOpen(false)
    }
  }

  const handleDeleteLesson = (event: React.MouseEvent) => {
    event.stopPropagation()
    setConfirmDeleteDialogOpen(true)
    handleMenuClose(event)
  }

  const handleDeleteLessonConfirm = async () => {
    try {
      await onDelete(lesson.id)
    } catch (error) {
      console.error("Error deleting lesson:", error)
    } finally {
      setConfirmDeleteDialogOpen(false)
    }
  }

  const handleDialogClose = () => {
    setConfirmPermissionDialogOpen(false)
    setConfirmDeleteDialogOpen(false)
    lastClickTimeRef.current = 0
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current)
      clickTimeoutRef.current = null
    }
  }

  return (
    <Fade in timeout={300}>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          cursor: "pointer",
          minWidth: "200px",
          maxWidth: "300px",
          width: "100%",
          transition: "box-shadow 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
          },
        }}
        onClick={handleClick}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
            borderBottom: "1px solid #eee",
          }}
        >
          <Chip
            label={PERMISSION_LABELS[lesson.permission]?.label || "לא ידוע"}
            size="small"
            sx={{
              bgcolor: PERMISSION_LABELS[lesson.permission]?.color || "grey.500",
              color: "white",
              fontWeight: 600,
              fontSize: "0.75rem",
              borderRadius: "4px",
              py: "2px",
              px: "6px",
            }}
          />

          <IconButton size="small" onClick={handleMenuOpen} sx={{ p: 0.5 }}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
            textAlign: "center",
            minHeight: "60px",
          }}
        >
          {editingLessonId === lesson.id && type === "PERSONAL" ? (
            <TextField
              value={lessonName}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyPress}
              autoFocus
              variant="standard"
              fullWidth
              onClick={(e) => e.stopPropagation()}
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  textAlign: "center",
                  "& input": {
                    textAlign: "center",
                  },
                },
              }}
            />
          ) : (
            <Tooltip title={lesson.name} placement="top" arrow>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  fontSize: "1.1rem",
                  lineHeight: 1.4,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  wordBreak: "break-word",
                }}
              >
                {truncateName(lesson.name, 40)}
              </Typography>
            </Tooltip>
          )}
        </Box>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => handleMenuClose(undefined)}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            sx: { borderRadius: 1, minWidth: 160 },
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={(e) => handleMenuClose(e)}>
            <DownloadIcon sx={{ mr: 1 }} /> הורדה
          </MenuItem>

          <Tooltip
            title={
              <Box sx={{ textAlign: "right", p: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  פרטי שיעור
                </Typography>
                <Typography variant="body2">שם: {lesson.name}</Typography>
                <Typography variant="body2">תאריך יצירה: {lesson.createdAt ?? "לא ידוע"}</Typography>
                <Typography variant="body2">מורה: {lesson.ownerId ?? "לא ידוע"}</Typography>
                <Typography variant="body2">
                  הרשאה: {PERMISSION_LABELS[lesson.permission]?.label || "לא ידוע"}
                </Typography>
              </Box>
            }
            placement="left"
            arrow
            open={tooltipOpen}
            onOpen={() => setTooltipOpen(true)}
            onClose={() => setTooltipOpen(false)}
            disableFocusListener
            disableHoverListener={!Boolean(menuAnchor)}
            disableTouchListener
          >
            <MenuItem
              onMouseEnter={() => setTooltipOpen(true)}
              onMouseLeave={() => setTooltipOpen(false)}
              onClick={handleDetailsClick}
            >
              <InfoIcon sx={{ mr: 1 }} /> פרטים
            </MenuItem>
          </Tooltip>

          {type === "PERSONAL" && (
            <MenuItem onClick={handlePermissionChange}>
              <KeyIcon sx={{ mr: 1 }} /> שינוי הרשאה
            </MenuItem>
          )}
          {type === "PERSONAL" && (
            <MenuItem onClick={handleDeleteLesson}>
              <DeleteIcon sx={{ mr: 1 }} /> מחיקה
            </MenuItem>
          )}
        </Menu>

        <PopupDialog
          open={confirmPermissionDialogOpen}
          onClose={handleDialogClose}
          onConfirm={confirmPermissionChange}
          message={`האם אתה בטוח שברצונך לשנות את ההרשאה של "${lesson.name}"?`}
        />
        <PopupDialog
          open={confirmDeleteDialogOpen}
          onClose={handleDialogClose}
          onConfirm={handleDeleteLessonConfirm}
          message={`האם אתה בטוח שברצונך למחוק את השיעור "${lesson.name}"?`}
        />
      </Card>
    </Fade>
  )
}

export default LessonItem
