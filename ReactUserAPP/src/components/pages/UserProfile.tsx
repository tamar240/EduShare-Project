"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Typography,
  Button,
  TextField,
  Box,
  CircularProgress,
  Alert,
  Container,
  IconButton,
  InputAdornment,
  Avatar,
  Divider,
  Stack,
} from "@mui/material"
import { Visibility, VisibilityOff, Person, Email, Lock, Edit, Save, Cancel, AccountCircle } from "@mui/icons-material"
import axios from "axios"
// וודא שאתה מייבא את הפונקציות הנכונות מהקובץ שלך
import { getCookie, getUserDetailes } from "../login/Login"

interface User {
  id: number
  name: string
  email: string
  password?: string // סיסמה לא מוצגת אך עשויה להיות בחלק מבקשות
  createdAt: string
  updatedAt: string
  isDeleted: boolean
}

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<Partial<User>>({})
  const [currentUserId, setCurrentUserId] = useState<number | null>(null) // כאן נשמור את ה-ID של המשתמש מהטוקן
  const [showPassword, setShowPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)

  const baseUrl = import.meta.env.VITE_API_URL 

  // useEffect לטעינת ה-ID של המשתמש מהטוקן בפעם הראשונה
  useEffect(() => {
    const userDetails = getUserDetailes()
    if (userDetails && userDetails.id) {
      setCurrentUserId(Number(userDetails.id)) // וודא שה-ID הוא מספרי
    } else {
      setError("❌ לא ניתן לזהות את המשתמש. אנא התחבר מחדש.")
      setLoading(false)
    }
  }, [])

  // פונקציה לטעינת פרטי המשתמש
  const fetchUser = async () => {
    if (currentUserId === null) return // לא נבצע fetch אם אין לנו ID

    setLoading(true)
    setError(null)
    try {
      const token = getCookie("auth_token")
      if (!token) {
        throw new Error("❌ לא נמצא טוקן אימות. אנא התחבר מחדש.")
      }

      const response = await axios.get<User>(`${baseUrl}/api/User/${currentUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUser(response.data)
      setEditedUser(response.data) // מאתחל את הנתונים לעריכה
    } catch (err) {
      console.error("❌ שגיאה בטעינת פרטי משתמש:", err)
      setError("אירעה שגיאה בטעינת פרטי המשתמש.")
    } finally {
      setLoading(false)
    }
  }

  // טוען את פרטי המשתמש כאשר currentUserId משתנה (כלומר, כשהוא נטען מהטוקן)
  useEffect(() => {
    if (currentUserId !== null) {
      fetchUser()
    }
  }, [currentUserId]) // תלוי ב-currentUserId

  // פונקציה לטיפול בשינויים בשדות העריכה
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedUser((prev) => ({ ...prev, [name]: value }))
  }

  // פונקציה לשמירת שינויים
  const handleSave = async () => {
    setLoading(true)
    setError(null)
    if (currentUserId === null) {
      setError("❌ שגיאה: לא ניתן לעדכן ללא זיהוי משתמש.")
      setLoading(false)
      return
    }

    try {
      const token = getCookie("auth_token")
      if (!token) {
        throw new Error("❌ לא נמצא טוקן אימות. אנא התחבר מחדש.")
      }

      // ה-body של בקשת העדכון
      const updatePayload = {
        id: currentUserId, // השתמש ב-ID מהטוקן
        name: editedUser.name,
        email: editedUser.email,
        ...(editedUser.password &&
          editedUser.password !== "••••••••" && {
            password: editedUser.password,
          }),
      }

      await axios.put(`${baseUrl}/api/User/${currentUserId}`, updatePayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      setIsEditing(false) // חוזר למצב תצוגה
      fetchUser() // טוען מחדש את הנתונים כדי להציג את השינויים
      alert("✅ פרטי המשתמש עודכנו בהצלחה!")
    } catch (err) {
      console.error("❌ שגיאה בעדכון פרטי משתמש:", err)
      setError("אירעה שגיאה בעדכון פרטי המשתמש.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#f8fafc",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} sx={{ color: "#1e40af", mb: 3 }} />
          <Typography variant="h6" sx={{ color: "#334155", fontWeight: 300 }}>
            טוען פרטי משתמש...
          </Typography>
        </Box>
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#f8fafc",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          {error}
        </Alert>
      </Box>
    )
  }

  if (!user) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#f8fafc",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Alert severity="info">לא נמצאו פרטי משתמש.</Alert>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f8fafc",
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            background: "#ffffff",
            borderRadius: "2px",
            boxShadow: "0 1px 3px rgba(30,64,175,0.12), 0 1px 2px rgba(30,64,175,0.24)",
            overflow: "hidden",
            transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
            "&:hover": {
              boxShadow: "0 14px 28px rgba(30,64,175,0.25), 0 10px 10px rgba(30,64,175,0.22)",
            },
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              background: "#1e40af",
              color: "#fff",
              p: { xs: 4, md: 6 },
              textAlign: "center",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "1px",
                background: "linear-gradient(90deg, transparent, #3b82f6, transparent)",
              },
            }}
          >
            <Avatar
              sx={{
                width: { xs: 80, md: 100 },
                height: { xs: 80, md: 100 },
                mx: "auto",
                mb: 3,
                background: "#fff",
                color: "#1e40af",
                fontSize: { xs: "2rem", md: "2.5rem" },
                border: "3px solid #3b82f6",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <AccountCircle sx={{ fontSize: "inherit" }} />
            </Avatar>

            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 100,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                mb: 1,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              {user.name}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 300,
                opacity: 0.8,
                fontSize: { xs: "1rem", md: "1.2rem" },
                mb: 4,
              }}
            >
              {user.email}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 4,
                fontSize: "0.875rem",
                opacity: 0.6,
                fontWeight: 300,
              }}
            >
              <Box>
                <Typography variant="caption" display="block">
                  משתמש
                </Typography>
                <Typography variant="body2">#{user.id}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" display="block">
                  חבר מאז
                </Typography>
                <Typography variant="body2">{new Date(user.createdAt).toLocaleDateString("he-IL")}</Typography>
              </Box>
            </Box>
          </Box>

          {/* Content Section */}
          <Box sx={{ p: { xs: 4, md: 6 } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 200,
                  fontSize: { xs: "1.8rem", md: "2.2rem" },
                  color: "#1e40af",
                  letterSpacing: "-0.01em",
                }}
              >
                פרטים אישיים
              </Typography>

              {!isEditing && (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setIsEditing(true)}
                  sx={{
                    borderColor: "#1e40af",
                    color: "#1e40af",
                    borderWidth: "1px",
                    borderRadius: "0",
                    px: 3,
                    py: 1,
                    fontSize: "0.9rem",
                    fontWeight: 400,
                    textTransform: "none",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "#1e40af",
                      background: "#1e40af",
                      color: "#fff",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  ערוך פרופיל
                </Button>
              )}
            </Box>

            <Divider sx={{ mb: 6, borderColor: "#e2e8f0" }} />

            {!isEditing ? (
              <Stack spacing={6}>
                {/* Name Field */}
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Person sx={{ mr: 2, color: "#64748b", fontSize: "1.2rem" }} />
                    <Typography
                      variant="overline"
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        color: "#94a3b8",
                        textTransform: "uppercase",
                      }}
                    >
                      שם מלא
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 300,
                      fontSize: "1.5rem",
                      color: "#1e40af",
                      pl: 4,
                      borderLeft: "2px solid #e2e8f0",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderLeftColor: "#1e40af",
                      },
                    }}
                  >
                    {user.name}
                  </Typography>
                </Box>

                {/* Email Field */}
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Email sx={{ mr: 2, color: "#64748b", fontSize: "1.2rem" }} />
                    <Typography
                      variant="overline"
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        color: "#94a3b8",
                        textTransform: "uppercase",
                      }}
                    >
                      כתובת אימייל
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 300,
                      fontSize: "1.5rem",
                      color: "#1e40af",
                      pl: 4,
                      borderLeft: "2px solid #e2e8f0",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderLeftColor: "#1e40af",
                      },
                    }}
                  >
                    {user.email}
                  </Typography>
                </Box>

                {/* Password Field */}
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Lock sx={{ mr: 2, color: "#64748b", fontSize: "1.2rem" }} />
                    <Typography
                      variant="overline"
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        color: "#94a3b8",
                        textTransform: "uppercase",
                      }}
                    >
                      סיסמה
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      pl: 4,
                      borderLeft: "2px solid #e2e8f0",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderLeftColor: "#1e40af",
                      },
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 300,
                        fontSize: "1.5rem",
                        color: "#1e40af",
                        mr: 2,
                        fontFamily: "monospace",
                      }}
                    >
                      {showCurrentPassword ? user.password || "••••••••" : "••••••••"}
                    </Typography>
                    <IconButton
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      sx={{
                        color: "#64748b",
                        "&:hover": {
                          color: "#1e40af",
                          background: "rgba(30,64,175,0.04)",
                        },
                      }}
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </Box>
                </Box>
              </Stack>
            ) : (
              <Stack spacing={5}>
                <TextField
                  fullWidth
                  label="שם מלא"
                  name="name"
                  value={editedUser.name || ""}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "#64748b" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0,
                      fontSize: "1.2rem",
                      fontWeight: 300,
                      "& fieldset": {
                        borderColor: "#e2e8f0",
                        borderWidth: "1px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#1e40af",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1e40af",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#64748b",
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      "&.Mui-focused": {
                        color: "#1e40af",
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="כתובת אימייל"
                  name="email"
                  type="email"
                  value={editedUser.email || ""}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "#64748b" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0,
                      fontSize: "1.2rem",
                      fontWeight: 300,
                      "& fieldset": {
                        borderColor: "#e2e8f0",
                        borderWidth: "1px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#1e40af",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1e40af",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#64748b",
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      "&.Mui-focused": {
                        color: "#1e40af",
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="סיסמה חדשה (אופציונלי)"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={editedUser.password === "••••••••" ? "" : editedUser.password || ""}
                  onChange={handleChange}
                  placeholder="השאר ריק אם לא רוצה לשנות"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "#64748b" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0,
                      fontSize: "1.2rem",
                      fontWeight: 300,
                      "& fieldset": {
                        borderColor: "#e2e8f0",
                        borderWidth: "1px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#1e40af",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1e40af",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#64748b",
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      "&.Mui-focused": {
                        color: "#1e40af",
                      },
                    },
                  }}
                />

                <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 6 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={() => {
                      setIsEditing(false)
                      setEditedUser(user)
                    }}
                    sx={{
                      borderColor: "#cbd5e1",
                      color: "#64748b",
                      borderRadius: 0,
                      px: 4,
                      py: 1.5,
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      textTransform: "none",
                      "&:hover": {
                        borderColor: "#94a3b8",
                        background: "rgba(100,116,139,0.04)",
                      },
                    }}
                  >
                    ביטול
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    sx={{
                      background: "#1e40af",
                      color: "#fff",
                      borderRadius: 0,
                      px: 4,
                      py: 1.5,
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      textTransform: "none",
                      boxShadow: "none",
                      "&:hover": {
                        background: "#1d4ed8",
                        boxShadow: "0 4px 8px rgba(30,64,175,0.2)",
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    שמור שינויים
                  </Button>
                </Stack>
              </Stack>
            )}

            {/* Footer */}
            <Box sx={{ mt: 8, pt: 4, borderTop: "1px solid #e2e8f0", textAlign: "center" }}>
              <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                עדכון אחרון: {new Date(user.updatedAt).toLocaleDateString("he-IL")}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default UserProfile
