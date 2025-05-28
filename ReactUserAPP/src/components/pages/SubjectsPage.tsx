"use client"

import { Container, Box } from "@mui/material"
import UserFilesPage from "./UserFilesPage"
import { useLocation } from "react-router-dom"

const SubjectsPage = () => {
  const location = useLocation()
  const type = location.state?.type || "PUBLIC" // ברירת מחדל אם לא הגיע כלום
  console.log("type in subjects page:", type);
  

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box>
        <UserFilesPage type={type} />
      </Box>
    </Container>
  )
}

export default SubjectsPage
