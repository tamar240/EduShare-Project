// import { useEffect, useRef, useState } from 'react';
// import axios from 'axios';
// import { getCookie } from './login/Login';

// export interface UploadedFile {
//   id: number;
//   fileName: string;
//   fileType: string;
//   filePath: string;
//   size: number;
//   lessonId: number;
// }

// const useUserFileGallery = (userId: number) => {
//   const [files, setFiles] = useState<UploadedFile[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [viewUrls, setViewUrls] = useState<Record<string, string>>({});
//   const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const observer = useRef<IntersectionObserver | null>(null);

//   useEffect(() => {
//     const fetchFiles = async () => {
//       try {
//         const token = getCookie('auth_token');
//         const response = await axios.get(`https://localhost:7249/api/UploadedFile/user/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setFiles(response.data);
//       } catch (err) {
//         console.error('שגיאה בקבלת הקבצים:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFiles();
//   }, [userId]);

//   const loadViewUrl = async (filePath: string) => {
//     if (viewUrls[filePath]) return;
//     try {
//       const token = getCookie('auth_token');
//       const response = await axios.get('https://localhost:7249/api/upload/presigned-url/view', {
//         params: { filePath },
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setViewUrls(prev => ({ ...prev, [filePath]: response.data.url }));
//     } catch (err) {
//       console.error(`שגיאה בטעינת URL עבור ${filePath}:`, err);
//     }
//   };

//   const previewRef = (file: UploadedFile) => {
//     const ref = (node: HTMLDivElement | null) => {
//       if (node && !viewUrls[file.filePath]) {
//         if (!observer.current) {
//           observer.current = new IntersectionObserver(entries => {
//             entries.forEach(entry => {
//               if (entry.isIntersecting) {
//                 const path = entry.target.getAttribute('data-filepath');
//                 if (path) loadViewUrl(path);
//               }
//             });
//           });
//         }
//         node.setAttribute('data-filepath', file.filePath);
//         observer.current.observe(node);
//       }
//     };
//     return ref;
//   };

//   const handleDeleteFile = async () => {
//     if (selectedFileId === null) return;
//     try {
//       const token = getCookie('auth_token');
//       await axios.delete(`https://localhost:7249/api/UploadedFile/${selectedFileId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setFiles(prev => prev.filter(f => f.id !== selectedFileId));
//     } catch (err) {
//       console.error('שגיאה במחיקת הקובץ:', err);
//     } finally {
//       setDialogOpen(false);
//       setSelectedFileId(null);
//     }
//   };

//   return {
//     files,
//     loading,
//     viewUrls,
//     previewRef,
//     handleDeleteFile,
//     dialogOpen,
//     setDialogOpen,
//     selectedFileId,
//     setSelectedFileId,
//   };
// };

// export default useUserFileGallery;
