"use client"

import { useParams, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Container, Box, CircularProgress, Typography } from "@mui/material"
import axios from "axios"
import { getCookie } from "../login/Login"
import type { Lesson } from "../typies/types"
import LessonDisplay from "../foldersAndFilesPage/LessonDisplay"

const LessonDisplayPage = () => {
  const { subjectId, lessonId } = useParams<{ subjectId: string; lessonId: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const lessonType = location.state?.type || "PERSONAL"; // נשמר רק אם הגיע

  const baseUrl = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchLesson = async () => {
      if (location.state?.lesson) {
        setLesson(location.state.lesson)
        setLoading(false)
        return
      }

      if (!lessonId) {
        setError("מזהה שיעור לא תקין")
        setLoading(false)
        return
      }

      try {
        const token = getCookie("auth_token")
        if (!token) {
          navigate("/")
          return
        }

        const response = await axios.get(`${baseUrl}/api/Lesson/${lessonId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        setLesson(response.data)
      } catch (err) {
        console.error("Error fetching lesson:", err)
        setError("שגיאה בטעינת השיעור")
      } finally {
        setLoading(false)
      }
    }

    fetchLesson()
  }, [lessonId, location.state, navigate, baseUrl])

const handleGoBack = () => {
  navigate(`/subjects/${subjectId}/lessons`, {
    state: { type: lessonType }
  });
};

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    )
  }

  if (error || !lesson) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <Typography variant="h6" color="error">
            {error || "שיעור לא נמצא"}
          </Typography>
        </Box>
      </Container>
    )
  }

  return <LessonDisplay lesson={lesson} subjectId={Number(subjectId)} onGoBack={handleGoBack} />
}

export default LessonDisplayPage
