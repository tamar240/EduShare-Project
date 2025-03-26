
import React, { useState, MouseEvent } from "react";
 import {
  Paper, Box, Typography, IconButton, TextField, Menu, Tooltip, Button,
  MenuItem
 } from "@mui/material";
 import MoreVertIcon from "@mui/icons-material/MoreVert";
 import PopupDialog from '../PopupDialog';

 export interface Lesson {
  id: number;
  name: string;
  permission: number;
  createdAt?: string;
  ownerId?: number;
 }

 interface PermissionLabel {
  label: string;
  color: string;
 }

 const PERMISSION_LABELS: Record<number, PermissionLabel> = {
  0: { label: "PRIVATE", color: "#d32f2f" },
  1: { label: "PUBLIC", color: "#388e3c" }
 };

 interface LessonItemProps {
  lesson: Lesson;
  onDelete: (lessonId: number) => Promise<void>;
  onUpdate: (updatedLesson: Lesson) => void;
  onPermissionChange: (lessonId: number, newPermission: number) => Promise<void>;
 }

 const LessonItem = ({ lesson, onDelete, onUpdate, onPermissionChange }: LessonItemProps) => {
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [lessonName, setLessonName] = useState<string>(lesson.name);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
  const [confirmPermissionDialogOpen, setConfirmPermissionDialogOpen] = useState<boolean>(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState<boolean>(false);

  const handleDoubleClick = () => {
  setEditingLessonId(lesson.id);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setLessonName(event.target.value);
  };

  const handleBlur = async () => {
  if (lessonName.trim() !== "" && lessonName !== lesson.name) {
   const updatedLesson = { ...lesson, name: lessonName };
   onUpdate(updatedLesson);
  }
  setEditingLessonId(null);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
  if (event.key === "Enter") {
   handleBlur();
  }
  };

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
  setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
  setMenuAnchor(null);
  setTooltipOpen(false);
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
  <Paper elevation={2} sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
   <Button
    variant="contained"
    size="small"
    onClick={handleMenuOpen}
    sx={{ backgroundColor: PERMISSION_LABELS[lesson.permission].color, mr: 1 }}
   >
    {PERMISSION_LABELS[lesson.permission].label}
   </Button>

   <Box sx={{ flexGrow: 1 }} onDoubleClick={handleDoubleClick}>
    {editingLessonId === lesson.id ? (
     <TextField
      value={lessonName}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyPress}
      autoFocus
      variant="standard"
      fullWidth
     />
    ) : (
     <Typography variant="subtitle1">{lesson.name}</Typography>
    )}
   </Box>

   <IconButton onClick={handleMenuOpen}>
    <MoreVertIcon />
   </IconButton>

   <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose} elevation={1}>
    <MenuItem>⬇️ הורדה</MenuItem>
    <Tooltip
     title={
      <Box sx={{ textAlign: "right", p: 1 }}>
       <Typography variant="subtitle2" fontWeight="bold">פרטי שיעור</Typography>
       <Typography variant="body2">שם: {lesson.name}</Typography>
       <Typography variant="body2">תאריך יצירה: {lesson.createdAt ?? "לא ידוע"}</Typography>
       <Typography variant="body2">מורה: {lesson.ownerId ?? "לא ידוע"}</Typography>
       <Typography variant="body2">הרשאה: {lesson.permission ?? "לא ידוע"}</Typography>
      </Box>
     }
     placement="left"
     arrow
     open={tooltipOpen}
     onOpen={() => setTooltipOpen(true)}
     onClose={() => setTooltipOpen(false)}
    >
     <MenuItem onMouseEnter={() => setTooltipOpen(true)} onMouseLeave={() => setTooltipOpen(false)}>
      ⬅️ פרטים
     </MenuItem>
    </Tooltip>
    <MenuItem onClick={handlePermissionChange}>🔒 שינוי הרשאה  </MenuItem>
    <MenuItem onClick={handleDeleteLesson}>❌ מחיקה </MenuItem>
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
  </Paper>
  );
 };

 export default LessonItem;