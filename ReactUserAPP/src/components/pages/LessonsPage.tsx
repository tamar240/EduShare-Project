"use client"

import { useParams, useLocation } from "react-router-dom"
import { Container } from "@mui/material"
import LessonsGrid from "../foldersAndFilesPage/LessonsList"

const LessonsPage = () => {
  const { subjectId } = useParams<{ subjectId: string }>()
  const location = useLocation()

  // Get additional data from navigation state if available
  const subjectName = location.state?.subjectName
  const lessonType = location.state?.type || "PERSONAL" // Default to PERSONAL

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <LessonsGrid subjectId={Number(subjectId)} type={lessonType} subjectName={subjectName} selectedSubjectLessons={null} />
    </Container>
  )
}

export default LessonsPage
