import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; 
import { Link, useNavigate } from 'react-router-dom';
import { getUserDetailes, removeCookie } from '../login/Login';

const Header: React.FC = () => {
  const navigate = useNavigate(); 

  // פונקציה ללוגאאוט
  const handleLogout = () => {
   removeCookie("auth_token");
   navigate('/');
  };
  const user = getUserDetailes();
  console.log("user", user);
  
  const firstLetter = user?.name?.charAt(0).toUpperCase() ?? '?';
 

  return (
    <AppBar elevation={0} sx={{ backgroundColor: 'White' }}>
    <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton component={Link} to="/profile" sx={{ ml: 2 }}>
      <Avatar sx={{ bgcolor: '#4A90E2', width: 25, height: 25, fontWeight: 'bold' }}>
       {firstLetter}
      </Avatar>
      </IconButton>

        <IconButton onClick={handleLogout} sx={{ color: '#4A90E2', fontSize: '30px', ml: 1 }}>
          <ExitToAppIcon fontSize="inherit" />
        </IconButton>
      </Box>
  
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: '34px',
            fontWeight: 'bold',
            animation: 'colorChange 5s infinite',
            background: 'linear-gradient(90deg, #4A90E2, #50E3C2, #B8E986, #F8E71C)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textTransform: 'uppercase',
          }}
        >
          EDUShare
        </Typography>
      </Box>
  
      <Box sx={{ width: '120px' }} />
    </Toolbar>
  </AppBar>
  
  
  );
};

export default Header;
