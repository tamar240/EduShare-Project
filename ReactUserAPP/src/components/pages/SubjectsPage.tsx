"use client"

import { Container, Box } from "@mui/material"
import UserFilesPage from "../UserFilesPage"
// Import your existing subjects component here
// import SubjectsGrid from "../components/SubjectsGrid"

const SubjectsPage = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box>
        {/* Your existing subjects grid component */}
        {/* <SubjectsGrid /> */}
   <UserFilesPage type={"PUBLIC"}></UserFilesPage>
      </Box>
    </Container>
  )
}

export default SubjectsPage
