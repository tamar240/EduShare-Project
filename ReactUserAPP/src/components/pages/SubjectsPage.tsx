"use client"

import { Container, Box } from "@mui/material"
// Import your existing subjects component here
// import SubjectsGrid from "../components/SubjectsGrid"

const SubjectsPage = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box>
        {/* Your existing subjects grid component */}
        {/* <SubjectsGrid /> */}
        <div>רשימת המקצועות - כאן תכניס את הקומפוננטה הקיימת שלך</div>
      </Box>
    </Container>
  )
}

export default SubjectsPage
