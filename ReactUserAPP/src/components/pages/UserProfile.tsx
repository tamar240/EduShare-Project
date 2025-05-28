
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
    Grid,
    Card,
    CardContent,
} from "@mui/material"
import { Visibility, VisibilityOff, Person, Email, Lock, Edit, Save, Cancel, AccountCircle } from "@mui/icons-material"
import axios from "axios"
import { getCookie, getUserDetailes } from "../login/Login"

interface User {
    id: number
    name: string
    email: string
    password?: string
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
    const [currentUserId, setCurrentUserId] = useState<number | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)

    const baseUrl = import.meta.env.VITE_API_URL

    useEffect(() => {
        const userDetails = getUserDetailes()
        if (userDetails && userDetails.id) {
            setCurrentUserId(Number(userDetails.id))
        } else {
            setError("❌ לא ניתן לזהות את המשתמש. אנא התחבר מחדש.")
            setLoading(false)
        }
    }, [])

    const fetchUser = async () => {
        if (currentUserId === null) return

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
            setEditedUser(response.data)
        } catch (err) {
            console.error("❌ שגיאה בטעינת פרטי משתמש:", err)
            setError("אירעה שגיאה בטעינת פרטי המשתמש.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (currentUserId !== null) {
            fetchUser()
        }
    }, [currentUserId])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setEditedUser((prev) => ({ ...prev, [name]: value }))
    }

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

            const updatePayload = {
                id: currentUserId,
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
            setIsEditing(false)
            fetchUser()
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
            <Box sx={{ minHeight: "100vh", background: "#f8fafc", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box sx={{ textAlign: "center" }}>
                    <CircularProgress size={60} sx={{ color: "#1e40af", mb: 3 }} />
                    <Typography variant="h6" sx={{ color: "#334155", fontWeight: 300 }}>טוען פרטי משתמש...</Typography>
                </Box>
            </Box>
        )
    }

    if (error) {
        return (
            <Box sx={{ minHeight: "100vh", background: "#f8fafc", display: "flex", justifyContent: "center", alignItems: "center", p: 2 }}>
                <Alert severity="error" sx={{ maxWidth: 500 }}>{error}</Alert>
            </Box>
        )
    }

    if (!user) {
        return (
            <Box sx={{ minHeight: "100vh", background: "#f8fafc", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Alert severity="info">לא נמצאו פרטי משתמש.</Alert>
            </Box>
        )
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={4} sx={{ minHeight: "80vh" }}>
                {/* Right Side - User Info */}
                <Grid item xs={12} md={5}>
                    <Card sx={{ height: "100%", background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)", color: "white", borderRadius: 3, boxShadow: "0 20px 40px rgba(30,64,175,0.3)" }}>
                        <CardContent sx={{ p: 6, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", height: "100%" }}>
                            <Avatar sx={{ width: 120, height: 120, mb: 4, background: "rgba(255,255,255,0.2)", color: "white", fontSize: "3rem", border: "4px solid rgba(255,255,255,0.3)" }}>
                                <AccountCircle sx={{ fontSize: "inherit" }} />
                            </Avatar>
                            
                            <Typography variant="h3" sx={{ fontWeight: 200, mb: 1, letterSpacing: "-0.02em" }}>
                                {user.name}
                            </Typography>
                            
                            <Typography variant="h6" sx={{ fontWeight: 300, opacity: 0.9, mb: 4 }}>
                                {user.email}
                            </Typography>

                            <Box sx={{ display: "flex", gap: 4, mb: 4, opacity: 0.8 }}>
                                <Box>
                                    <Typography variant="caption" display="block">משתמש</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>#{user.id}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" display="block">איתנו מאז</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {new Date(user.createdAt).toLocaleDateString("he-IL")}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ mt: "auto", pt: 4, borderTop: "1px solid rgba(255,255,255,0.2)", width: "100%" }}>
                                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                    עדכון אחרון: {new Date(user.updatedAt).toLocaleDateString("he-IL")}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Left Side - Edit Form */}
                <Grid item xs={12} md={7}>
                    <Card sx={{ height: "100%", borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
                        <CardContent sx={{ p: 6, height: "100%" }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                                <Typography variant="h4" sx={{ fontWeight: 300, color: "#1e40af" }}>
                                    פרטים אישיים
                                </Typography>
                                
                                {!isEditing && (
                                    <Button variant="outlined" startIcon={<Edit />} onClick={() => setIsEditing(true)}
                                        sx={{ borderColor: "#1e40af", color: "#1e40af", borderRadius: 2, px: 3, textTransform: "none",
                                            "&:hover": { background: "#1e40af", color: "#fff" } }}>
                                        ערוך פרופיל
                                    </Button>
                                )}
                            </Box>

                            {!isEditing ? (
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                    <Box>
                                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                            <Person sx={{ mr: 2, color: "#64748b" }} />
                                            <Typography variant="overline" sx={{ color: "#94a3b8", fontWeight: 600 }}>שם מלא</Typography>
                                        </Box>
                                        <Typography variant="h5" sx={{ fontWeight: 300, color: "#1e40af", pl: 4, borderLeft: "3px solid #e2e8f0" }}>
                                            {user.name}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                            <Email sx={{ mr: 2, color: "#64748b" }} />
                                            <Typography variant="overline" sx={{ color: "#94a3b8", fontWeight: 600 }}>כתובת אימייל</Typography>
                                        </Box>
                                        <Typography variant="h5" sx={{ fontWeight: 300, color: "#1e40af", pl: 4, borderLeft: "3px solid #e2e8f0" }}>
                                            {user.email}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                            <Lock sx={{ mr: 2, color: "#64748b" }} />
                                            <Typography variant="overline" sx={{ color: "#94a3b8", fontWeight: 600 }}>סיסמה</Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center", pl: 4, borderLeft: "3px solid #e2e8f0" }}>
                                            <Typography variant="h5" sx={{ fontWeight: 300, color: "#1e40af", mr: 2, fontFamily: "monospace" }}>
                                                {showCurrentPassword ? user.password || "••••••••" : "••••••••"}
                                            </Typography>
                                            <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                sx={{ color: "#64748b", "&:hover": { color: "#1e40af", background: "rgba(30,64,175,0.04)" } }}>
                                                {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Box>
                            ) : (
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                    <TextField fullWidth label="שם מלא" name="name" value={editedUser.name || ""} onChange={handleChange}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: "#64748b" }} /></InputAdornment> }}
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, "&.Mui-focused fieldset": { borderColor: "#1e40af" } } }} />

                                    <TextField fullWidth label="כתובת אימייל" name="email" type="email" value={editedUser.email || ""} onChange={handleChange}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: "#64748b" }} /></InputAdornment> }}
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, "&.Mui-focused fieldset": { borderColor: "#1e40af" } } }} />

                                    <TextField fullWidth label="סיסמה חדשה (אופציונלי)" name="password" 
                                        type={showPassword ? "text" : "password"}
                                        value={editedUser.password === "••••••••" ? "" : editedUser.password || ""}
                                        onChange={handleChange} placeholder="השאר ריק אם לא רוצה לשנות"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><Lock sx={{ color: "#64748b" }} /></InputAdornment>,
                                            endAdornment: <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }}
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, "&.Mui-focused fieldset": { borderColor: "#1e40af" } } }} />

                                    <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 4 }}>
                                        <Button variant="outlined" startIcon={<Cancel />} onClick={() => { setIsEditing(false); setEditedUser(user) }}
                                            sx={{ borderColor: "#cbd5e1", color: "#64748b", borderRadius: 2, px: 4, textTransform: "none" }}>
                                            ביטול
                                        </Button>
                                        <Button variant="contained" startIcon={<Save />} onClick={handleSave}
                                            sx={{ background: "#1e40af", borderRadius: 2, px: 4, textTransform: "none", 
                                                "&:hover": { background: "#1d4ed8", transform: "translateY(-1px)" } }}>
                                            שמור שינויים
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}

export default UserProfile