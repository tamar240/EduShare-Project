import { Menu, MenuItem } from "@mui/material";

interface SubjectContextMenuProps {
  mouseX: number;
  mouseY: number;
  subjectId: number;
  onClose: () => void;
}

const SubjectContextMenu: React.FC<SubjectContextMenuProps> = ({ mouseX, mouseY, subjectId, onClose }) => {
  return (
    <Menu
      open={Boolean(mouseX && mouseY)}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={{ top: mouseY, left: mouseX }}
    >
      <MenuItem onClick={onClose}>📄 פרטי השיעור</MenuItem>
      <MenuItem onClick={onClose}>🗑️ מחיקת השיעור</MenuItem>
    </Menu>
  );
};

export default SubjectContextMenu;
