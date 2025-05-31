"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { Lesson, LessonListProps } from "../typies/types"
import { getCookie } from "../login/Login"
import axios from "axios"
import {
  Button,
  Grid,
  Box,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  Tooltip
} from "@mui/material"
import {
  ArrowForward as ArrowForwardIcon,
  ArrowUpward,
  ArrowDownward,
  Clear as ClearIcon
} from "@mui/icons-material"
import LessonItem from "./LessonItem"
import AddLesson from "./AddLesson"

interface LessonsGridProps extends LessonListProps {
  subjectName?: string
}

const LessonsGrid = ({ subjectId, type, subjectName }: LessonsGridProps) => {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [addLessonDialogOpen, setAddLessonDialogOpen] = useState(false)
  const [filterText, setFilterText] = useState("")
  const [sortOption, setSortOption] = useState("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const navigate = useNavigate()

  const baseUrl = import.meta.env.VITE_API_URL

  const fetchLessons = async () => {
    try {
      const token = getCookie("auth_token")
      const response = await axios.get<Lesson[]>(
        `${baseUrl}/api/Lesson/${type === "PUBLIC" ? "public" : "my"}/${subjectId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setLessons(response.data)
    } catch (error) {
      console.error("Failed to fetch lessons", error)
    }
  }

  useEffect(() => {
    if (subjectId) {
      fetchLessons()
    }
  }, [subjectId, type])

  const handleUpdateLesson = (updatedLesson: Lesson) => {
    setLessons(lessons.map((lesson) => (lesson.id === updatedLesson.id ? updatedLesson : lesson)))
  }

  const handleDeleteLesson = async (lessonId: number) => {
    try {
      const token = getCookie("auth_token")
      await axios.delete(`${baseUrl}/api/Lesson/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setLessons(lessons.filter((lesson) => lesson.id !== lessonId))
    } catch (error) {
      console.error("Failed to delete lesson", error)
    }
  }

  const handlePermissionChange = async (lessonId: number, newPermission: number) => {
    try {
      const token = getCookie("auth_token")
      await axios.put(
        `${baseUrl}/api/Lesson/permission/${lessonId}`,
        { permission: newPermission },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } },
      )
      setLessons(lessons.map((lesson) => (lesson.id === lessonId ? { ...lesson, permission: newPermission } : lesson)))
    } catch (error) {
      console.error("Failed to update permission", error)
    }
  }

  const handleGoBackToSubjects = () => {
    navigate("/subjects", { state: { type } })
  }

  const handleLessonClick = (lesson: Lesson) => {
    navigate(`/subjects/${subjectId}/lessons/${lesson.id}`, {
      state: { lesson, subjectId, subjectName, type },
    })
  }

  const handleResetFilters = () => {
    setFilterText("")
    setSortOption("createdAt")
    setSortDirection("desc")
  }

  const filteredLessons = [...lessons]
    .filter((lesson) => lesson.name.toLowerCase().includes(filterText.toLowerCase()))
    .sort((a, b) => {
      let value = 0
      if (sortOption === "createdAt") {
        value = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (sortOption === "updatedAt") {
        value = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      } else if (sortOption === "name") {
        value = a.name.localeCompare(b.name)
      } else if (sortOption === "permission") {
        value = a.permission - b.permission
      }
      return sortDirection === "asc" ? value : -value
    })

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Button variant="outlined" startIcon={<ArrowForwardIcon />} onClick={handleGoBackToSubjects}>
          חזרה לרשימת המקצועות
        </Button>

        <Box sx={{ textAlign: "right" }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: "primary.main", mb: 1 }}>
            {subjectName || `מקצוע ${subjectId}`}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {filteredLessons.length} שיעורים
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
        <Grid item xs={12} sm={4} md={3}>
          <TextField
            fullWidth
            size="small"
            label="חיפוש לפי שם"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>מיון לפי</InputLabel>
            <Select
              value={sortOption}
              label="מיון לפי"
              onChange={(e) => setSortOption(e.target.value)}
            >
              <MenuItem value="createdAt">תאריך יצירה</MenuItem>
              <MenuItem value="updatedAt">תאריך עדכון</MenuItem>
              <MenuItem value="name">שם</MenuItem>
              <MenuItem value="permission">הרשאה</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {(sortOption === "createdAt" || sortOption === "updatedAt" || sortOption === "permission") && (
          <Grid item>
            <IconButton onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}> 
              {sortDirection === "asc" ? <ArrowUpward /> : <ArrowDownward />} 
            </IconButton>
          </Grid>
        )}
        <Grid item>
          <Tooltip title="איפוס סינון ומיון">
            <IconButton size="small" onClick={handleResetFilters} sx={{ ml: -1 }}>
              <ClearIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={12} md sx={{ display: "flex", justifyContent: "flex-end" }}>
          {type === "PERSONAL" && (
            <Button variant="contained" size="small" onClick={() => setAddLessonDialogOpen(true)}>
              הוסף שיעור
            </Button>
          )}
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {filteredLessons.map((lesson) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={lesson.id}>
            <LessonItem
              lesson={lesson}
              onDelete={handleDeleteLesson}
              onUpdate={handleUpdateLesson}
              onPermissionChange={handlePermissionChange}
              onLessonClick={handleLessonClick}
              type={type}
            />
          </Grid>
        ))}
      </Grid>

      <AddLesson
        open={addLessonDialogOpen}
        onClose={() => setAddLessonDialogOpen(false)}
        subjectId={subjectId}
        onLessonAdded={fetchLessons}
      />
    </Box>
  )
}

export default LessonsGrid
