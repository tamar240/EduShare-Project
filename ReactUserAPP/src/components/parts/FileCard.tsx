// import {
//     Card,
//     CardMedia,
//     CardContent,
//     Typography,
//     Button,
//     Box,
//     CircularProgress,
//   } from '@mui/material';
//   import DeleteIcon from '@mui/icons-material/Delete';
// import { UploadedFile } from '../useUserFileGallery';
  
//   interface Props {
//     file: UploadedFile;
//     viewUrl?: string;
//     previewRef: (node: HTMLDivElement | null) => void;
//     onDelete: () => void;
//   }
  
//   const FileCard = ({ file, viewUrl, previewRef, onDelete }: Props) => {
//     const renderPreview = () => {
//       const type = file.fileType;
  
//       if (!viewUrl) {
//         return (
//           <Box textAlign="center" py={2}>
//             <CircularProgress size={24} />
//           </Box>
//         );
//       }
  
//       if (type.startsWith('image/')) {
//         return <CardMedia component="img" height="140" image={viewUrl} alt={file.fileName} />;
//       }
  
//       if (type === 'application/pdf') {
//         return <iframe src={viewUrl} style={{ width: '100%', height: 200, border: 'none' }} />;
//       }
  
//       if (type.startsWith('video/')) {
//         return (
//           <video controls style={{ width: '100%', height: 200 }}>
//             <source src={viewUrl} type={type} />
//           </video>
//         );
//       }
  
//       const label = type.includes('word')
//         ? 'פתח Word'
//         : type.includes('presentation') || type.includes('powerpoint')
//         ? 'פתח PowerPoint'
//         : 'הורד קובץ';
  
//       return (
//         <Button variant="outlined" href={viewUrl} target="_blank">
//           {label}
//         </Button>
//       );
//     };
  
//     return (
//       <Card
//         sx={{
//           height: '100%',
//           display: 'flex',
//           flexDirection: 'column',
//           borderRadius: 3,
//           boxShadow: 3,
//           transition: '0.3s',
//           '&:hover': { boxShadow: 6 },
//         }}
//         ref={previewRef}
//       >
//         {renderPreview()}
//         <CardContent>
//           <Typography variant="body1" fontWeight="bold">
//             📄 {file.fileName}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             סוג: {file.fileType} | גודל: {(file.size / 1024).toFixed(1)} KB
//           </Typography>
//           <Button
//             startIcon={<DeleteIcon />}
//             color="error"
//             onClick={onDelete}
//             sx={{ mt: 1 }}
//           >
//             מחק קובץ
//           </Button>
//         </CardContent>
//       </Card>
//     );
//   };
  
//   export default FileCard;
  