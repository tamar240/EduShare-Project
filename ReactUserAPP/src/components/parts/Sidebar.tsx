import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  CssBaseline,
  Box,
  IconButton,
  Tooltip,
  Button,
  Divider,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SchoolIcon from "@mui/icons-material/School";
import DeleteIcon from "@mui/icons-material/Delete";
import PublicIcon from "@mui/icons-material/Public";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import ClassIcon from "@mui/icons-material/Class";
import { getCookie } from "../login/Login";


const drawerWidth = 240;
const collapsedWidth = 60;

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openDialog, setOpenDialog] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>("");

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddSubject = async () => {
    const token = getCookie("auth_token");
    debugger
    if (!subjectName.trim()) return;
    try {
      await axios.post(
        "https://localhost:7249/api/Subject/add",
        {
          name: subjectName
        },
        {
          headers: { "Authorization": `Bearer ${token}` },
        }
      );
      alert("✅ המקצוע נוסף בהצלחה!");
      window.location.reload();
      setSubjectName("");
      setOpenDialog(false);
    } catch (error) {
      console.error("❌ שגיאה בהוספת מקצוע:", error);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: collapsed ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: collapsed ? collapsedWidth : drawerWidth,
            transition: "width 0.3s",
            overflowX: "hidden",
          },
        }}
      >
        <Toolbar>
          <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ mx: "auto" }}>
            <MenuIcon />
          </IconButton>
        </Toolbar>

        <Box sx={{ p: 1, textAlign: "center" }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            fullWidth={!collapsed}
            onClick={handleMenuOpen}
            sx={{
              justifyContent: collapsed ? "center" : "flex-start",
              transition: "all 0.3s",
            }}
          >
            {!collapsed && "חדש"}
          </Button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <CreateNewFolderIcon />
              </ListItemIcon>
              <ListItemText primary="תיקייה חדשה" />
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <ClassIcon />
              </ListItemIcon>
              <ListItemText primary="צור שיעור חדש" />
            </MenuItem>
            <MenuItem onClick={() => setOpenDialog(true)}>
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="הוסף מקצוע" />
            </MenuItem>
          </Menu>
        </Box>

        <Divider />

        <List>
          {[
            { text: "המקצועות שלי", icon: <SchoolIcon />, path: "/userFilesPage" },
            { text: "העלה קובץ ", icon: <FolderIcon />, path: "/upload" },
            { text: "הקבצים שלי", icon: <InsertDriveFileIcon />, path: "/myFiles" },
            { text: "מערכים ציבורים", icon: <PublicIcon />, path: "/publicPage" },
            { text: "אשפה", icon: <DeleteIcon />, path: "/trash" },
            
          ].map((item, index) => (
            <Tooltip key={index} title={collapsed ? item.text : ""} placement="right">
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={() => {
                    setSelectedMenuItem(item.text);
                    window.scrollTo(0, 0);
                  }}
                  selected={selectedMenuItem === item.text}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  {!collapsed && <ListItemText primary={item.text} />}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Drawer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>הוסף מקצוע חדש</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="שם המקצוע"
            fullWidth
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>ביטול</Button>
          <Button onClick={handleAddSubject} variant="contained" color="primary">
            הוסף
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sidebar;
