import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // אייקון חץ ללוגאאוט
import { Link, useNavigate } from 'react-router-dom';
import { getUserDetailes, removeCookie } from '../login/Login';

const Header: React.FC = () => {
  const navigate = useNavigate(); // משתמש ב-useNavigate לנווט לדף אחר

  // פונקציה ללוגאאוט
  const handleLogout = () => {
   removeCookie("auth_token");
   navigate('/'); // ניווט לדף הלוגין
  };
  const user = getUserDetailes();
  console.log("user", user);
  
  const firstLetter = user?.name?.charAt(0).toUpperCase() ?? '?';
 

  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: 'transparent' }}>
    <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
      {/* אייקונים – בצד שמאל */}
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
  
      {/* טקסט EDUShare – במרכז עם אנימציה */}
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
  
      {/* רווח ימני ריק כדי לשמור על מרכוז אמיתי */}
      <Box sx={{ width: '120px' }} />
    </Toolbar>
  </AppBar>
  
  
  );
};

export default Header;
// import React from 'react';
// import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Logout icon
// import { Link, useNavigate } from 'react-router-dom';
// import { removeCookie } from '../login/Login';

// const Header: React.FC = () => {
//   const navigate = useNavigate();

//   // Logout function
//   const handleLogout = () => {
//     removeCookie("auth_token");
//     navigate('/'); // Redirect to login page
//   };

//   return (
//     <AppBar
//       position="relative" // Ensures the header aligns with the sidebar
//       elevation={1}
//       sx={{
//         backgroundColor: 'white', // Set a background color to make it visible
//         zIndex: (theme) => theme.zIndex.drawer + 1, // Ensure it stays above other elements
//       }}
//     >
//       <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         {/* Logo or Title */}
//         <Typography
//           variant="h6"
//           sx={{
//             color: '#4A90E2',
//             fontSize: '30px',
//             fontWeight: 'bold',
//             marginLeft: '20px', // Add some spacing from the left
//           }}
//         >
//           EDUShare
//         </Typography>

//         {/* Icons */}
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           {/* Profile Icon */}
//           <IconButton
//             component={Link}
//             to="/profile"
//             sx={{
//               color: '#4A90E2',
//               marginLeft: '10px',
//               fontSize: '30px',
//             }}
//           >
//             <AccountCircleIcon />
//           </IconButton>

//           {/* Logout Icon */}
//           <IconButton
//             onClick={handleLogout}
//             sx={{
//               color: '#4A90E2', // Ensure the color contrasts with the background
//               marginLeft: '10px',
//               fontSize: '30px',
//             }}
//           >
//             <ExitToAppIcon />
//           </IconButton>
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Header;