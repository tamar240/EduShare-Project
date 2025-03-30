import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // אייקון חץ ללוגאאוט
import { Link, useNavigate } from 'react-router-dom';
import { removeCookie } from '../login/Login';

const Header: React.FC = () => {
  const navigate = useNavigate(); // משתמש ב-useNavigate לנווט לדף אחר

  // פונקציה ללוגאאוט
  const handleLogout = () => {
   removeCookie("auth_token");
   navigate('/'); // ניווט לדף הלוגין
  };

  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: 'transparent' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: '#4A90E2', marginRight: '60px', fontSize: '30px' }}>
            EDUShare
          </Typography>

          {/* אייקון פרופיל */}
          <IconButton component={Link} to="/profile" sx={{ color: '#4A90E2', marginLeft: '10px', fontSize: '30px' }}>
            <AccountCircleIcon />
          </IconButton>

          {/* אייקון חץ ללוגאאוט */}
          <IconButton onClick={handleLogout} sx={{ color: '#4A90E2', marginLeft: '10px', fontSize: '30px' }}>
            <ExitToAppIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
