// "use client"

// import type React from "react"
// import { useState, useRef, type MouseEvent } from "react"
// import {
//   Box,
//   Typography,
//   IconButton,
//   TextField,
//   Menu,
//   Tooltip,
//   MenuItem,
//   Card,
//   CardContent,
//   Chip,
//   Fade,
// } from "@mui/material"
// import {
//   MoreVert as MoreVertIcon,
//   School as SchoolIcon,
//   Public as PublicIcon,
//   Lock as LockIcon,
//   Visibility as VisibilityIcon,
// } from "@mui/icons-material"
// import PopupDialog from "../parts/PopupDialog"
// import type { Lesson } from "../typies/types"
// import axios from "axios"
// import { getCookie } from "../login/Login"

// interface PermissionLabel {
//   label: string
//   color: string
// }

// const PERMISSION_LABELS: Record<number, PermissionLabel> = {
//   0: { label: "פרטי", color: "#d32f2f" },
//   1: { label: "ציבורי", color: "#388e3c" },
// }

// interface LessonItemProps {
//   lesson: Lesson
//   onDelete: (lessonId: number) => Promise<void>
//   onUpdate: (updatedLesson: Lesson) => void
//   onPermissionChange: (lessonId: number, newPermission: number) => Promise<void>
//   onLessonClick: (lesson: Lesson) => void
//   type: "PUBLIC" | "PERSONAL"
// }

// const LessonItem = ({ lesson, onDelete, onUpdate, onPermissionChange, onLessonClick, type }: LessonItemProps) => {
//   const [editingLessonId, setEditingLessonId] = useState<number | null>(null)
//   const [lessonName, setLessonName] = useState<string>(lesson.name)
//   const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
//   const [tooltipOpen, setTooltipOpen] = useState<boolean>(false)
//   const [confirmPermissionDialogOpen, setConfirmPermissionDialogOpen] = useState<boolean>(false)
//   const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState<boolean>(false)

//   const lastClickTimeRef = useRef<number>(0)
//   const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
//   const DOUBLE_CLICK_DELAY = 250
//   const baseUrl = import.meta.env.VITE_API_URL

//   // Function to truncate lesson name if too long
//   const truncateName = (name: string, maxLength = 25) => {
//     if (name.length <= maxLength) return name
//     return name.substring(0, maxLength) + "..."
//   }

//   const handleClick = (event: React.MouseEvent) => {
//     event.stopPropagation()
//     const now = Date.now()
//     const timeSinceLastClick = now - lastClickTimeRef.current

//     if (timeSinceLastClick < DOUBLE_CLICK_DELAY) {
//       // Double click - edit mode (only for personal lessons)
//       if (clickTimeoutRef.current) {
//         clearTimeout(clickTimeoutRef.current)
//         clickTimeoutRef.current = null
//       }
//       lastClickTimeRef.current = 0
//       if (type === "PERSONAL") {
//         setEditingLessonId(lesson.id)
//       }
//     } else {
//       // Single click - navigate to lesson content
//       lastClickTimeRef.current = now
//       clickTimeoutRef.current = setTimeout(() => {
//         onLessonClick(lesson)
//         clickTimeoutRef.current = null
//       }, DOUBLE_CLICK_DELAY)
//     }
//   }

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setLessonName(event.target.value)
//   }

//   const handleBlur = async () => {
//     if (lessonName.trim() !== "" && lessonName !== lesson.name) {
//       const updatedLesson = {
//         name: lessonName,
//         subjectId: lesson.subjectId,
//         ownerId: lesson.ownerId,
//         permission: lesson.permission,
//       }

//       const token = getCookie("auth_token")

//       if (token) {
//         try {
//           const response = await axios.put(`${baseUrl}/api/Lesson/${lesson.id}`, updatedLesson, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           })

//           if (response.status >= 200 && response.status < 300) {
//             onUpdate({ ...lesson, name: lessonName })
//           }
//         } catch (error) {
//           console.error("Error updating lesson:", error)
//         }
//       } else {
//         console.error("No token found")
//       }
//     }
//     setEditingLessonId(null)
//   }

//   const handleKeyPress = (event: React.KeyboardEvent) => {
//     if (event.key === "Enter") {
//       handleBlur()
//     }
//   }

//   const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
//     event.stopPropagation()
//     setMenuAnchor(event.currentTarget)
//   }

//   const handleMenuClose = () => {
//     setMenuAnchor(null)
//     setTooltipOpen(false)
//   }

//   const handlePermissionChange = () => {
//     setConfirmPermissionDialogOpen(true)
//   }

//   const confirmPermissionChange = async () => {
//     const newPermission = lesson.permission === 0 ? 1 : 0
//     await onPermissionChange(lesson.id, newPermission)
//     setConfirmPermissionDialogOpen(false)
//     handleMenuClose()
//   }

//   const handleDeleteLesson = () => {
//     setConfirmDeleteDialogOpen(true)
//   }

//   const handleDeleteLessonConfirm = async () => {
//     await onDelete(lesson.id)
//     setConfirmDeleteDialogOpen(false)
//     handleMenuClose()
//   }

//   return (
//     <Fade in timeout={300}>
//       <Card
//         sx={{
//           height: "100%",
//           display: "flex",
//           flexDirection: "column",
//           bgcolor: "background.paper",
//           cursor: "pointer",
//           transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//           "&:hover": {
//             transform: "translateY(-4px)",
//             boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
            
//           },
//         }}
//         onClick={handleClick}
//       >
//         <CardContent sx={{ p: 0, flexGrow: 1, display: "flex", flexDirection: "column" }}>
//           {/* Header */}
//           <Box
//             sx={{
//               p: 3,
//               borderBottom: "1px solid",
//               borderColor: "grey.200",
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "flex-start",
//             }}
//           >
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//               <Chip
//                 icon={lesson.permission === 1 ? <PublicIcon /> : <LockIcon />}
//                 label={PERMISSION_LABELS[lesson.permission]?.label || "לא ידוע"}
//                 size="small"
//                 color={lesson.permission === 1 ? "success" : "default"}
//                 variant="outlined"
//                 sx={{ fontWeight: 600, fontSize: "0.75rem" }}
//               />
//               {type === "PERSONAL" && (
//                 <IconButton
//                   size="small"
//                   onClick={handleMenuOpen}
//                   sx={{
//                     bgcolor: "grey.100",
//                     "&:hover": { bgcolor: "grey.200" },
//                   }}
//                 >
//                   <MoreVertIcon fontSize="small" />
//                 </IconButton>
//               )}
//             </Box>

//             <Box
//               sx={{
//                 width: 40,
//                 height: 40,
//                 borderRadius: 2,
//                 bgcolor: "primary.main",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: "white",
//               }}
//             >
//               <SchoolIcon />
//             </Box>
//           </Box>

//           {/* Content */}
//           <Box sx={{ flexGrow: 1, p: 3, display: "flex", flexDirection: "column", justifyContent: "center" }}>
//             {editingLessonId === lesson.id && type === "PERSONAL" ? (
//               <TextField
//                 value={lessonName}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 onKeyDown={handleKeyPress}
//                 autoFocus
//                 variant="standard"
//                 fullWidth
//                 sx={{ mb: 2 }}
//               />
//             ) : (
//               <Tooltip title={lesson.name} placement="top" arrow>
//                 <Typography
//                   variant="h6"
//                   sx={{
//                     fontWeight: 600,
//                     color: "text.primary",
//                     textAlign: "center",
//                     mb: 2,
//                     fontSize: "1.1rem",
//                     lineHeight: 1.4,
//                     minHeight: "2.8rem",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                     wordBreak: "break-word",
//                     hyphens: "auto",
//                   }}
//                 >
//                   {truncateName(lesson.name, 30)}
//                 </Typography>
//               </Tooltip>
//             )}

//             <Box sx={{ textAlign: "center" }}>
//               <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//                 שיעור מס׳
//               </Typography>
//               <Typography variant="h5" sx={{ fontWeight: 700, color: "primary.main" }}>
//                 {lesson.id}
//               </Typography>
//             </Box>
//           </Box>

//           {/* Footer */}
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               p: 3,
//               borderTop: "1px solid",
//               borderColor: "grey.200",
//               bgcolor: "grey.50",
//             }}
//           >
//             <Tooltip title="צפייה בשיעור">
//               <IconButton
//                 sx={{
//                   bgcolor: "primary.main",
//                   color: "white",
//                   "&:hover": { bgcolor: "primary.dark" },
//                 }}
//               >
//                 <VisibilityIcon />
//               </IconButton>
//             </Tooltip>
//           </Box>

//           {/* Menu */}
//           <Menu
//             anchorEl={menuAnchor}
//             open={Boolean(menuAnchor)}
//             onClose={handleMenuClose}
//             transformOrigin={{ horizontal: "right", vertical: "top" }}
//             anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
//             PaperProps={{
//               sx: { borderRadius: 2, minWidth: 160 },
//             }}
//           >
//             <MenuItem>⬇️ הורדה</MenuItem>
//             <Tooltip
//               title={
//                 <Box sx={{ textAlign: "right", p: 1 }}>
//                   <Typography variant="subtitle2" fontWeight="bold">
//                     פרטי שיעור
//                   </Typography>
//                   <Typography variant="body2">שם: {lesson.name}</Typography>
//                   <Typography variant="body2">תאריך יצירה: {lesson.createdAt ?? "לא ידוע"}</Typography>
//                   <Typography variant="body2">מורה: {lesson.ownerId ?? "לא ידוע"}</Typography>
//                   <Typography variant="body2">הרשאה: {lesson.permission ?? "לא ידוע"}</Typography>
//                 </Box>
//               }
//               placement="left"
//               arrow
//               open={tooltipOpen}
//               onOpen={() => setTooltipOpen(true)}
//               onClose={() => setTooltipOpen(false)}
//             >
//               <MenuItem onMouseEnter={() => setTooltipOpen(true)} onMouseLeave={() => setTooltipOpen(false)}>
//                 ⬅️ פרטים
//               </MenuItem>
//             </Tooltip>
//             {type === "PERSONAL" && <MenuItem onClick={handlePermissionChange}>🔒 שינוי הרשאה</MenuItem>}
//             {type === "PERSONAL" && <MenuItem onClick={handleDeleteLesson}>❌ מחיקה</MenuItem>}
//           </Menu>

//           <PopupDialog
//             open={confirmPermissionDialogOpen}
//             onClose={() => setConfirmPermissionDialogOpen(false)}
//             onConfirm={confirmPermissionChange}
//             message={`האם אתה בטוח שברצונך לשנות את ההרשאה של "${lesson.name}"?`}
//           />
//           <PopupDialog
//             open={confirmDeleteDialogOpen}
//             onClose={() => setConfirmDeleteDialogOpen(false)}
//             onConfirm={handleDeleteLessonConfirm}
//             message={`האם אתה בטוח שברצונך למחוק את השיעור "${lesson.name}"?`}
//           />
//         </CardContent>
//       </Card>
//     </Fade>
//   )
// }

// export default LessonItem
"use client";

import type React from "react";
import { useState, useRef, type MouseEvent } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Menu,
  Tooltip,
  MenuItem,
  Card,
  Chip,
  Fade,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Download as DownloadIcon, // Added for "הורדה"
  Info as InfoIcon, // Added for "פרטים"
  Key as KeyIcon, // Added for "שינוי הרשאה"
  Delete as DeleteIcon, // Added for "מחיקה"
} from "@mui/icons-material";
import PopupDialog from "../parts/PopupDialog";
import type { Lesson } from "../typies/types"; // Corrected typo: typies -> types
import axios from "axios";
import { getCookie } from "../login/Login";

interface PermissionLabel {
  label: string;
  color: string;
}

const PERMISSION_LABELS: Record<number, PermissionLabel> = {
  0: { label: "פרטי", color: "#d32f2f" },
  1: { label: "ציבורי", color: "#388e3c" },
};

interface LessonItemProps {
  lesson: Lesson;
  onDelete: (lessonId: number) => Promise<void>;
  onUpdate: (updatedLesson: Lesson) => void;
  onPermissionChange: (lessonId: number, newPermission: number) => Promise<void>;
  onLessonClick: (lesson: Lesson) => void;
  type: "PUBLIC" | "PERSONAL";
}

const LessonItem = ({
  lesson,
  onDelete,
  onUpdate,
  onPermissionChange,
  onLessonClick,
  type,
}: LessonItemProps) => {
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [lessonName, setLessonName] = useState<string>(lesson.name);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
  const [confirmPermissionDialogOpen, setConfirmPermissionDialogOpen] =
    useState<boolean>(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] =
    useState<boolean>(false);

  const lastClickTimeRef = useRef<number>(0);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const DOUBLE_CLICK_DELAY = 250;
  const baseUrl = import.meta.env.VITE_API_URL;

  // Function to truncate lesson name if too long
  const truncateName = (name: string, maxLength = 25) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
  };

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;

    if (timeSinceLastClick < DOUBLE_CLICK_DELAY) {
      // Double click - edit mode (only for personal lessons)
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
      }
      lastClickTimeRef.current = 0;
      if (type === "PERSONAL") {
        setEditingLessonId(lesson.id);
      }
    } else {
      // Single click - navigate to lesson content
      lastClickTimeRef.current = now;
      clickTimeoutRef.current = setTimeout(() => {
        onLessonClick(lesson);
        clickTimeoutRef.current = null;
      }, DOUBLE_CLICK_DELAY);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLessonName(event.target.value);
  };

  const handleBlur = async () => {
    if (lessonName.trim() !== "" && lessonName !== lesson.name) {
      const updatedLesson = {
        name: lessonName,
        subjectId: lesson.subjectId,
        ownerId: lesson.ownerId,
        permission: lesson.permission,
      };

      const token = getCookie("auth_token");

      if (token) {
        try {
          const response = await axios.put(
            `${baseUrl}/api/Lesson/${lesson.id}`,
            updatedLesson,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status >= 200 && response.status < 300) {
            onUpdate({ ...lesson, name: lessonName });
          }
        } catch (error) {
          console.error("Error updating lesson:", error);
        }
      } else {
        console.error("No token found");
      }
    }
    setEditingLessonId(null);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleBlur();
    }
  };

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setTooltipOpen(false); // Close tooltip when menu closes
  };

  const handlePermissionChange = () => {
    setConfirmPermissionDialogOpen(true);
  };

  const confirmPermissionChange = async () => {
    const newPermission = lesson.permission === 0 ? 1 : 0;
    await onPermissionChange(lesson.id, newPermission);
    setConfirmPermissionDialogOpen(false);
    handleMenuClose();
  };

  const handleDeleteLesson = () => {
    setConfirmDeleteDialogOpen(true);
  };

  const handleDeleteLessonConfirm = async () => {
    await onDelete(lesson.id);
    setConfirmDeleteDialogOpen(false);
    handleMenuClose();
  };

  return (
    <Fade in timeout={300}>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          borderRadius: "8px", // Rounded corners
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow
          cursor: "pointer",
          minWidth: "200px", // Minimum width for the card
          maxWidth: "300px", // Maximum width for the card
          width: "100%", // Take full width of parent container
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)", // Slightly more pronounced shadow on hover
            transform: "translateY(-2px)",
          },
        }}
        onClick={handleClick}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1, // Padding inside the card
            borderBottom: "1px solid #eee", // Subtle border below header
          }}
        >
          {/* Permission Chip */}
          <Chip
            label={PERMISSION_LABELS[lesson.permission]?.label || "לא ידוע"}
            size="small"
            sx={{
              bgcolor:
                PERMISSION_LABELS[lesson.permission]?.color || "grey.500",
              color: "white",
              fontWeight: 600,
              fontSize: "0.75rem",
              borderRadius: "4px", // Slightly rounded chip
              py: "2px", // Vertical padding
              px: "6px", // Horizontal padding
            }}
          />

          {/* MoreVert Icon and Menu */}
          {type === "PERSONAL" && (
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{ p: 0.5 }} // Smaller padding for icon button
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        {/* Lesson Name / TextField */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2, // Padding around the name
            textAlign: "center",
            minHeight: "60px", // Ensure consistent height for name area
          }}
        >
          {editingLessonId === lesson.id && type === "PERSONAL" ? (
            <TextField
              value={lessonName}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyPress}
              autoFocus
              variant="standard"
              fullWidth
              InputProps={{
                disableUnderline: true, // Remove underline for minimal look
                sx: {
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  textAlign: "center",
                  "& input": {
                    textAlign: "center",
                  },
                },
              }}
            />
          ) : (
            <Tooltip title={lesson.name} placement="top" arrow>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  fontSize: "1.1rem",
                  lineHeight: 1.4,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2, // Limit to 2 lines for truncation
                  WebkitBoxOrient: "vertical",
                  wordBreak: "break-word",
                }}
              >
                {truncateName(lesson.name, 40)} {/* Allow more characters */}
              </Typography>
            </Tooltip>
          )}
        </Box>

        {/* Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            sx: { borderRadius: 1, minWidth: 160 }, // Slightly less rounded menu
          }}
        >
          <MenuItem onClick={handleMenuClose}>
            <DownloadIcon sx={{ mr: 1 }} /> הורדה
          </MenuItem>
          <Tooltip
            title={
              <Box sx={{ textAlign: "right", p: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  פרטי שיעור
                </Typography>
                <Typography variant="body2">שם: {lesson.name}</Typography>
                <Typography variant="body2">
                  תאריך יצירה: {lesson.createdAt ?? "לא ידוע"}
                </Typography>
                <Typography variant="body2">
                  מורה: {lesson.ownerId ?? "לא ידוע"}
                </Typography>
                <Typography variant="body2">
                  הרשאה:{" "}
                  {PERMISSION_LABELS[lesson.permission]?.label || "לא ידוע"}
                </Typography>
              </Box>
            }
            placement="left"
            arrow
            open={tooltipOpen}
            onOpen={() => setTooltipOpen(true)}
            onClose={() => setTooltipOpen(false)}
            disableFocusListener // Disable opening on focus
            disableHoverListener={!Boolean(menuAnchor)} // Only open on hover when menu is open
            disableTouchListener // Disable opening on touch
          >
            <MenuItem onMouseEnter={() => setTooltipOpen(true)} onMouseLeave={() => setTooltipOpen(false)}>
              <InfoIcon sx={{ mr: 1 }} /> פרטים
            </MenuItem>
          </Tooltip>
          {type === "PERSONAL" && (
            <MenuItem onClick={handlePermissionChange}>
              <KeyIcon sx={{ mr: 1 }} /> שינוי הרשאה
            </MenuItem>
          )}
          {type === "PERSONAL" && (
            <MenuItem onClick={handleDeleteLesson}>
              <DeleteIcon sx={{ mr: 1 }} /> מחיקה
            </MenuItem>
          )}
        </Menu>

        <PopupDialog
          open={confirmPermissionDialogOpen}
          onClose={() => setConfirmPermissionDialogOpen(false)}
          onConfirm={confirmPermissionChange}
          message={`האם אתה בטוח שברצונך לשנות את ההרשאה של "${lesson.name}"?`}
        />
        <PopupDialog
          open={confirmDeleteDialogOpen}
          onClose={() => setConfirmDeleteDialogOpen(false)}
          onConfirm={handleDeleteLessonConfirm}
          message={`האם אתה בטוח שברצונך למחוק את השיעור "${lesson.name}"?`}
        />
      </Card>
    </Fade>
  );
};

export default LessonItem;