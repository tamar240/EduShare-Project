import { useState, useEffect } from "react";
import {
  Typography,
  Button,
  TextField,
  Box,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import axios from "axios";
// וודא שאתה מייבא את הפונקציות הנכונות מהקובץ שלך
import { getCookie, getUserDetailes } from "../login/Login";

interface User {
  id: number;
  name: string;
  email: string;
  password?: string; // סיסמה לא מוצגת אך עשויה להיות בחלק מבקשות
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [currentUserId, setCurrentUserId] = useState<number | null>(null); // כאן נשמור את ה-ID של המשתמש מהטוקן

  const baseUrl =
    import.meta.env.VITE_API_URL || "https://edushare-api.onrender.com"; // וודא שה-URL הבסיסי מוגדר

  // useEffect לטעינת ה-ID של המשתמש מהטוקן בפעם הראשונה
  useEffect(() => {
    const userDetails = getUserDetailes();
    if (userDetails && userDetails.id) {
      setCurrentUserId(Number(userDetails.id)); // וודא שה-ID הוא מספרי
    } else {
      setError("❌ לא ניתן לזהות את המשתמש. אנא התחבר מחדש.");
      setLoading(false);
    }
  }, []);

  // פונקציה לטעינת פרטי המשתמש
  const fetchUser = async () => {
    if (currentUserId === null) return; // לא נבצע fetch אם אין לנו ID

    setLoading(true);
    setError(null);
    try {
      const token = getCookie("auth_token");
      if (!token) {
        throw new Error("❌ לא נמצא טוקן אימות. אנא התחבר מחדש.");
      }

      const response = await axios.get<User>(
        `${baseUrl}/api/User/${currentUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data);
      setEditedUser(response.data); // מאתחל את הנתונים לעריכה
    } catch (err) {
      console.error("❌ שגיאה בטעינת פרטי משתמש:", err);
      setError("אירעה שגיאה בטעינת פרטי המשתמש.");
    } finally {
      setLoading(false);
    }
  };

  // טוען את פרטי המשתמש כאשר currentUserId משתנה (כלומר, כשהוא נטען מהטוקן)
  useEffect(() => {
    if (currentUserId !== null) {
      fetchUser();
    }
  }, [currentUserId]); // תלוי ב-currentUserId

  // פונקציה לטיפול בשינויים בשדות העריכה
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  // פונקציה לשמירת שינויים
  const handleSave = async () => {
    setLoading(true);
    setError(null);
    if (currentUserId === null) {
      setError("❌ שגיאה: לא ניתן לעדכן ללא זיהוי משתמש.");
      setLoading(false);
      return;
    }

    try {
      const token = getCookie("auth_token");
      if (!token) {
        throw new Error("❌ לא נמצא טוקן אימות. אנא התחבר מחדש.");
      }

      // ה-body של בקשת העדכון
      const updatePayload = {
        id: currentUserId, // השתמש ב-ID מהטוקן
        name: editedUser.name,
        email: editedUser.email,
        password: editedUser.password, // אם תרצה לאפשר שינוי סיסמה, יהיה צורך באינפוט נפרד עבורה
      };

      await axios.put(`${baseUrl}/api/User/${currentUserId}`, updatePayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setIsEditing(false); // חוזר למצב תצוגה
      fetchUser(); // טוען מחדש את הנתונים כדי להציג את השינויים
      alert("✅ פרטי המשתמש עודכנו בהצלחה!");
    } catch (err) {
      console.error("❌ שגיאה בעדכון פרטי משתמש:", err);
      setError("אירעה שגיאה בעדכון פרטי המשתמש.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          טוען פרטי משתמש...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!user) {
    return <Alert severity="info">לא נמצאו פרטי משתמש.</Alert>;
  }

  return (
    <Paper
      elevation={3}
      sx={{ p: 4, maxWidth: 600, margin: "2rem auto", borderRadius: "10px" }}
    >
      <Typography variant="h4" gutterBottom align="center" color="primary">
        פרופיל משתמש
      </Typography>
      {!isEditing ? (
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            **שם:** {user.name}
          </Typography>
          <Typography variant="h6" sx={{ mb: 1 }}>
            **אימייל:** {user.email}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            **תאריך יצירה:**{" "}
            {new Date(user.createdAt).toLocaleDateString("he-IL")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            **עדכון אחרון:**{" "}
            {new Date(user.updatedAt).toLocaleDateString("he-IL")}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsEditing(true)}
            fullWidth
          >
            ערוך פרופיל
          </Button>
        </Box>
      ) : (
        <Box>
          <TextField
            fullWidth
            margin="normal"
            label="שם"
            name="name"
            value={editedUser.name || ""}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="אימייל"
            name="email"
            type="email"
            value={editedUser.email || ""}
            onChange={handleChange}
          />
          {/* שימו לב: לא מאפשרים עריכת תאריכי יצירה/עדכון או ID */}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            **תאריך יצירה:**{" "}
            {new Date(user.createdAt).toLocaleDateString("he-IL")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            **עדכון אחרון:**{" "}
            {new Date(user.updatedAt).toLocaleDateString("he-IL")}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setIsEditing(false);
                setEditedUser(user); // מבטל שינויים לא שמורים
              }}
            >
              ביטול
            </Button>
            <Button variant="contained" color="primary" onClick={handleSave}>
              שמור שינויים
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default UserProfile;