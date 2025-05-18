// "use client"

// import { createTheme } from "@mui/material"

// // Create RTL theme with custom colors
// export const lessonDisplayTheme = createTheme({
//   direction: "rtl",
//   palette: {
//     primary: {
//       main: "#1976d2",
//       light: "#42a5f5",
//       dark: "#1565C0",
//     },
//     secondary: {
//       main: "#7e57c2", // Purple accent color
//       light: "#b085f5",
//       dark: "#4d2c91",
//     },
//     error: {
//       main: "#e53935",
//       light: "#ff6b6b",
//       dark: "#c62828",
//     },
//     info: {
//       main: "#2a5699", // Word blue color
//       light: "#5b7cb6",
//       dark: "#1e3c6e",
//     },
//     background: {
//       default: "#f5f7fa",
//       paper: "#ffffff",
//     },
//     text: {
//       primary: "#263238",
//       secondary: "#546e7a",
//     },
//   },
//   typography: {
//     fontFamily: '"Heebo", "Roboto", "Arial", sans-serif',
//     h4: {
//       fontWeight: 800,
//       fontSize: "2.2rem",
//     },
//     h5: {
//       fontWeight: 700,
//       fontSize: "1.5rem",
//     },
//     h6: {
//       fontWeight: 600,
//       fontSize: "1.25rem",
//     },
//     subtitle1: {
//       fontWeight: 600,
//       fontSize: "1rem",
//     },
//     button: {
//       fontWeight: 600,
//     },
//   },
//   shape: {
//     borderRadius: 12,
//   },
//   components: {
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: 16,
//           boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
//           transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
//           "&:hover": {
//             boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
//             transform: "translateY(-5px)",
//           },
//         },
//       },
//     },
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 10,
//           textTransform: "none",
//           fontWeight: 600,
//           boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//           padding: "8px 16px",
//           transition: "all 0.2s ease-in-out",
//           "&:hover": {
//             transform: "translateY(-2px)",
//             boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//           },
//         },
//         containedPrimary: {
//           backgroundImage: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
//           "&:hover": {
//             backgroundImage: "linear-gradient(135deg, #1565C0 0%, #1976d2 100%)",
//           },
//         },
//         containedSecondary: {
//           backgroundImage: "linear-gradient(135deg, #7e57c2 0%, #b085f5 100%)",
//           "&:hover": {
//             backgroundImage: "linear-gradient(135deg, #4d2c91 0%, #7e57c2 100%)",
//           },
//         },
//         outlined: {
//           borderWidth: "1.5px",
//           "&:hover": {
//             borderWidth: "1.5px",
//           },
//         },
//       },
//     },
//     MuiPaper: {
//       styleOverrides: {
//         root: {
//           boxShadow: "0 15px 35px rgba(0,0,0,0.05)",
//         },
//       },
//     },
//     MuiDivider: {
//       styleOverrides: {
//         root: {
//           borderColor: "rgba(0,0,0,0.08)",
//           margin: "16px 0",
//         },
//       },
//     },
//     MuiChip: {
//       styleOverrides: {
//         root: {
//           fontWeight: 600,
//           borderRadius: 6,
//         },
//         filled: {
//           boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//         },
//       },
//     },
//     MuiSkeleton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 8,
//         },
//       },
//     },
//     MuiCircularProgress: {
//       styleOverrides: {
//         root: {
//           color: "#1976d2",
//         },
//       },
//     },
//     MuiLinearProgress: {
//       styleOverrides: {
//         root: {
//           borderRadius: 4,
//           height: 6,
//         },
//       },
//     },
//     MuiIconButton: {
//       styleOverrides: {
//         root: {
//           transition: "transform 0.2s ease-in-out",
//           "&:hover": {
//             transform: "scale(1.1)",
//           },
//         },
//       },
//     },
//     MuiLink: {
//       styleOverrides: {
//         root: {
//           textDecoration: "none",
//           transition: "color 0.2s ease-in-out",
//           fontWeight: 500,
//           "&:hover": {
//             textDecoration: "none",
//           },
//         },
//       },
//     },
//   },
// })