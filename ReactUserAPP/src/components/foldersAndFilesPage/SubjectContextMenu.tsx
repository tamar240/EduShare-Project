import { Menu, MenuItem, Tooltip, Typography, Box } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { getCookie } from "../login/Login";
import PopupDialog from "../parts/PopupDialog";
import { Subject } from "../typies/types";

interface SubjectContextMenuProps {
  mouseX: number;
  mouseY: number;
  subject: Subject;
  onClose: () => void;
  type:'PUBLIC'|'PERSONAL';
}

const SubjectContextMenu: React.FC<SubjectContextMenuProps> = ({ mouseX, mouseY, subject, onClose,type }) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const baseUrl = import.meta.env.VITE_API_URL;


  const handleDeleteSubject = async () => {
    
    try {
      const token = getCookie("auth_token");
      await axios.delete(`${baseUrl}/api/Subject/${subject.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onClose(); 
      window.location.reload();
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  return (
    <>
      <Menu
        open={Boolean(mouseX && mouseY)}
        onClose={onClose}
        anchorReference="anchorPosition"
        anchorPosition={{ top: mouseY, left: mouseX }}
      >
        <Tooltip
          title={
            <Box sx={{ textAlign: "right", p: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">פרטי מקצוע</Typography>
              <Typography variant="body2">שם: {subject.name}</Typography>
              <Typography variant="body2">תאריך יצירה: {subject.createdAt ?? "לא ידוע"}</Typography>
              <Typography variant="body2">תאריך עדכון: {subject.updatedAt ?? "לא ידוע"}</Typography>
              <Typography variant="body2">מורה: {subject.ownerId ?? "לא ידוע"}</Typography>
            </Box>
          }
          placement="left"
          arrow
          open={tooltipOpen}
          onOpen={() => setTooltipOpen(true)}
          onClose={() => setTooltipOpen(false)}
        >
          <MenuItem onMouseEnter={() => setTooltipOpen(true)} onMouseLeave={() => setTooltipOpen(false)}>
            📄 פרטי המקצוע
          </MenuItem>
        </Tooltip>
{   type==='PERSONAL' &&    <MenuItem onClick={() => setOpenConfirm(true)}>🗑️ מחיקת המקצוע</MenuItem>}
      </Menu>

      <PopupDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleDeleteSubject}
        message={`האם אתה בטוח שברצונך למחוק את המקצוע?\nמחיקת מקצוע זה תמחוק את כל השיעורים הקיימים בו.`}
      />
    </>
  );
};

export default SubjectContextMenu;
