
"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Fade,
  Slide,
  Stack,
  Avatar,
} from "@mui/material"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import {
  School as SchoolIcon,
  CloudUpload as CloudUploadIcon,
  Share as ShareIcon,
  AutoAwesome as AutoAwesomeIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Analytics as AnalyticsIcon,
  PlayArrow as PlayArrowIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@mui/icons-material"
import Login from "../login/Login"

const theme = createTheme({
  direction: "rtl",
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb",
      light: "#3b82f6",
      dark: "#1d4ed8",
    },
    secondary: {
      main: "#7c3aed",
      light: "#8b5cf6",
      dark: "#6d28d9",
    },
    background: {
      default: "#ffffff",
      paper: "#f8fafc",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
  },
  typography: {
    fontFamily: '"Inter", "Heebo", "Roboto", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: "-0.025em",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h3: {
      fontWeight: 600,
      letterSpacing: "-0.025em",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          border: "1px solid #e2e8f0",
          background: "#ffffff",
          transition: "all 0.3s ease",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
          padding: "12px 24px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
        },
      },
    },
  },
})

const features = [
  {
    icon: <CloudUploadIcon sx={{ fontSize: 40 }} />,
    title: "העלאה חכמה",
    description: "העלו קבצים בקלות עם תמיכה בכל סוגי הקבצים הנפוצים ועיבוד אוטומטי",
    color: "#2563eb",
    bgColor: "#dbeafe",
  },
  {
    icon: <AutoAwesomeIcon sx={{ fontSize: 40 }} />,
    title: "עיבוד אוטומטי",
    description: "המערכת מעבדת ומסכמת את החומרים שלכם באופן אוטומטי עם בינה מלאכותית",
    color: "#7c3aed",
    bgColor: "#ede9fe",
  },
  {
    icon: <ShareIcon sx={{ fontSize: 40 }} />,
    title: "שיתוף קל",
    description: "שתפו חומרי לימוד עם תלמידים וקולגות בקלות ובאבטחה מלאה",
    color: "#059669",
    bgColor: "#d1fae5",
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    title: "אבטחה מתקדמת",
    description: "כל הקבצים מאוחסנים בענן מאובטח עם הצפנה ברמה הגבוהה ביותר",
    color: "#d97706",
    bgColor: "#fef3c7",
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
    title: "ביצועים מהירים",
    description: "גישה מהירה לכל החומרים שלכם מכל מקום ובכל זמן",
    color: "#dc2626",
    bgColor: "#fee2e2",
  },
  {
    icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
    title: "ניתוח ודוחות",
    description: "קבלו תובנות על השימוש בחומרים ועל התקדמות התלמידים",
    color: "#0891b2",
    bgColor: "#cffafe",
  },
]

const steps = [
  {
    number: "01",
    title: "הרשמה והתחברות",
    description: "צרו חשבון חינם והתחברו למערכת בקלות",
  },
  {
    number: "02",
    title: "העלאת חומרים",
    description: "העלו את חומרי הלימוד שלכם - מסמכים, תמונות, מצגות ועוד",
  },
  {
    number: "03",
    title: "ארגון ועיבוד",
    description: "המערכת מארגנת ומעבדת את החומרים באופן אוטומטי",
  },
  {
    number: "04",
    title: "שיתוף והוראה",
    description: "שתפו עם התלמידים והתחילו ללמד בצורה חדשה ומתקדמת",
  },
]

export default function Homepage() {
  const [scrollY, setScrollY] = useState(0)
  const [showFeatures, setShowFeatures] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      if (window.scrollY > 300) {
        setShowFeatures(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated Background Elements */}
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
            "&::before": {
              content: '""',
              position: "absolute",
              top: "20%",
              left: "10%", // Changed from right to left for RTL
              width: "300px",
              height: "300px",
              background: "radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)",
              borderRadius: "50%",
              animation: "float 6s ease-in-out infinite",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: "20%",
              right: "10%", // Changed from left to right for RTL
              width: "200px",
              height: "200px",
              background: "radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%)",
              borderRadius: "50%",
              animation: "float 8s ease-in-out infinite reverse",
            },
          }}
        />

        {/* Header */}
        <Box
          component="header"
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            background: scrollY > 50 ? "rgba(255, 255, 255, 0.95)" : "transparent",
            backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
            transition: "all 0.3s ease",
            borderBottom: scrollY > 50 ? "1px solid rgba(226, 232, 240, 0.8)" : "none",
          }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 2,
                flexDirection: "row-reverse", // RTL direction
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  fontSize:50,
                  background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 0 60px rgba(37, 99, 235, 0.3)",
                }}
              >
                EduShare
              </Typography>

           
            </Box>
          </Container>
        </Box>

        {/* Hero Section */}
        <Container maxWidth="xl" sx={{ pt: { xs: 12, md: 16 }, pb: 8 }}>
          <Grid container spacing={4} alignItems="center" minHeight="80vh" direction="row-reverse">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box sx={{ textAlign: "right" }}>
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                      mb: 3,
                      color: "#1e293b",
                      textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    פלטפורמת החינוך
                    <br />
                    <span
                      style={{
                        background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      של העתיד
                    </span>
                  </Typography>

                  <Typography
                    variant="h5"
                    sx={{
                      mb: 4,
                      color: "text.secondary",
                      lineHeight: 1.6,
                      fontSize: { xs: "1.1rem", md: "1.25rem" },
                      textAlign: "right",
                    }}
                  >
                    EduShare היא פלטפורמה מתקדמת שעוזרת למורים לארגן, לשתף ולנהל חומרי לימוד בצורה חכמה ואינטואיטיבית.
                    המטרה שלנו היא להפוך את ההוראה לקלה, מהירה ומאורגנת יותר עבור מורים ותלמידים כאחד.
                  </Typography>

                  <Stack direction={{ xs: "column", sm: "row-reverse" }} spacing={3} sx={{ mb: 4 }}>
                    <Login />
                    <Button
                      variant="outlined"
                      size="large"
                      endIcon={<PlayArrowIcon sx={{ transform: "scaleX(-1)" }} />} // Flip icon for RTL
                      onClick={scrollToFeatures}
                      sx={{
                        borderColor: "primary.main",
                        color: "primary.main",
                        "&:hover": {
                          borderColor: "primary.dark",
                          backgroundColor: "rgba(37, 99, 235, 0.05)",
                        },
                      }}
                    >
                      גלו איך זה עובד
                    </Button>
                  </Stack>

                  <Stack direction="row-reverse" spacing={4} sx={{ mt: 6, justifyContent: "flex-end" }}>
                    <Box textAlign="center">
                      <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main" }}>
                        1000+
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        מורים רשומים
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h4" sx={{ fontWeight: 700, color: "secondary.main" }}>
                        50K+
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        קבצים מועלים
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h4" sx={{ fontWeight: 700, color: "#059669" }}>
                        99.9%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        זמינות
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Fade>
            </Grid>

            <Grid item xs={12} md={6}>
              <Slide direction="right" in timeout={1500}>
                <Box
                  sx={{
                    position: "relative",
                    height: { xs: 300, md: 500 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: "80%",
                      height: "80%",
                      background: "linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)",
                      borderRadius: 4,
                      backdropFilter: "blur(20px)",
                      border: "2px solid rgba(37, 99, 235, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      overflow: "hidden",
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <SchoolIcon sx={{ fontSize: 120, color: "primary.main", opacity: 0.8 }} />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 20,
                        left: 20, // Changed from right to left for RTL
                        width: 60,
                        height: 60,
                        background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        animation: "pulse 2s infinite",
                        boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.3)",
                      }}
                    >
                      <AutoAwesomeIcon sx={{ color: "white" }} />
                    </Box>
                  </Box>
                </Box>
              </Slide>
            </Grid>
          </Grid>

          {/* Scroll Indicator */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 4,
              animation: "bounce 2s infinite",
            }}
          >
            <IconButton onClick={scrollToFeatures} sx={{ color: "text.secondary" }}>
              <KeyboardArrowDownIcon sx={{ fontSize: 40 }} />
            </IconButton>
          </Box>
        </Container>

        {/* Features Section */}
        <Box id="features" sx={{ py: 12, background: "rgba(248, 250, 252, 0.8)" }}>
          <Container maxWidth="xl">
            <Fade in={showFeatures} timeout={1000}>
              <Box textAlign="center" sx={{ mb: 8 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: "2rem", md: "3rem" },
                    mb: 3,
                    color: "#1e293b",
                  }}
                >
                 ?EduShare למה לבחור ב
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
                  פלטפורמה מתקדמת עם כלים חכמים שיעזרו לכם להפוך את ההוראה לחוויה מעולה
                </Typography>
              </Box>
            </Fade>

            <Grid container spacing={4} direction="row-reverse">
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Fade in={showFeatures} timeout={1000 + index * 200}>
                    <Card
                      sx={{
                        height: "100%",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 4, textAlign: "center" }}>
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            mx: "auto",
                            mb: 3,
                            backgroundColor: feature.bgColor,
                            color: feature.color,
                          }}
                        >
                          {feature.icon}
                        </Avatar>
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: "#1e293b" }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6, textAlign: "right" }}>
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* How It Works Section */}
        <Box sx={{ py: 12, background: "#ffffff" }}>
          <Container maxWidth="xl">
            <Box textAlign="center" sx={{ mb: 8 }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "3rem" },
                  mb: 3,
                  color: "#1e293b",
                }}
              >
              ?איך זה עובד
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
             שלבים פשוטים להתחיל להשתמש בפלטפורמה  4 
              </Typography>
            </Box>

            <Grid container spacing={4} direction="row-reverse">
              {steps.map((step, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Fade in timeout={1500 + index * 300}>
                    <Box textAlign="center">
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          mx: "auto",
                          mb: 3,
                          background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.5rem",
                          fontWeight: 700,
                          color: "white",
                          position: "relative",
                          boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.3)",
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                            opacity: 0.2,
                            animation: "pulse 2s infinite",
                          },
                        }}
                      >
                        {step.number}
                      </Box>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: "#1e293b" }}>
                        {step.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6, textAlign: "right" }}>
                        {step.description}
                      </Typography>
                    </Box>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            py: 12,
            background: "linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)",
            textAlign: "center",
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                mb: 3,
                color: "#1e293b",
              }}
            >
             ? מוכנים להתחיל
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              הצטרפו לאלפי המורים שכבר משתמשים ב-EduShare ומשפרים את חוויית ההוראה שלהם
            </Typography>
            <Login />
          </Container>
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 6,
            borderTop: "1px solid #e2e8f0",
            textAlign: "center",
            background: "#ffffff",
          }}
        >
         <Container maxWidth="xl">
  <Typography variant="body2" color="text.secondary">
    © 2025 EduShare. כל הזכויות שמורות.{" "}
    <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=tamar36603@gmail.com&su=פנייה%20מאתר%20EduShare&body=שלום%20רציתי%20לפנות%20בנוגע%20ל..."
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#0077cc', textDecoration: 'none', marginLeft: '5px' }}
        >
          support@EDUShare.co.il
        </a>
  </Typography>
</Container>

        </Box>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
        `}</style>
      </Box>
    </ThemeProvider>
  )
}
