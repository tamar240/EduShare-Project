"use client"

import { useEffect, useState } from "react"
import {  useNavigate } from "react-router-dom"
import type { Lesson, LessonListProps } from "../typies/types"
import { getCookie } from "../login/Login"
import axios from "axios"
import { Button, Grid, Box, Typography } from "@mui/material"
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material"
import LessonItem from "./LessonItem"
import AddLesson from "./AddLesson"

interface LessonsGridProps extends LessonListProps {
  subjectName?: string
}

const LessonsGrid = ({ subjectId, type, subjectName }: LessonsGridProps) => {
  console.log("type2", type);
  
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [addLessonDialogOpen, setAddLessonDialogOpen] = useState<boolean>(false)
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
    console.log("type", type);
    
    navigate("/subjects", { state: { type: type } })
  }

  const handleLessonClick = (lesson: Lesson) => {
    navigate(`/subjects/${subjectId}/lessons/${lesson.id}`, {
      state: { lesson, subjectId, subjectName,type },
    })
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Button variant="outlined" startIcon={<ArrowForwardIcon />} onClick={handleGoBackToSubjects} sx={{ mb: 2 }}>
          חזרה לרשימת המקצועות
        </Button>

        <Box sx={{ textAlign: "right" }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: "primary.main", mb: 1 }}>
            {subjectName || `מקצוע ${subjectId}`}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {lessons.length} שיעורים
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          {type === "PERSONAL" && (
            <Button variant="contained" onClick={() => setAddLessonDialogOpen(true)}>
              הוסף שיעור
            </Button>
          )}
        </Grid>

        {lessons.map((lesson) => (
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
