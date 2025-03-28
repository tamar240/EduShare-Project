import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login, { getCookie } from './components/login/Login';
import FileUpload from './components/file/FileUploader';
// import UserFilesPage from './components/UserFilesPage';
import Sidebar from './components/parts/Sidebar';
import './App.css'; // Assuming you have a CSS file for styling
import UserFilesPage from './components/UserFilesPage';


// const RoutesComponent: React.FC = () => {
//     return (
//         <BrowserRouter>
//             <div style={{ display: 'flex' }}>
//                 <Sidebar />
//                 <div style={{ flex: 1, padding: '20px' }}>
//                     <Routes>
//                         <Route path='/' element={<Login />} />
//                         <Route path='upload' element={<FileUpload />} />
//                         <Route path='userFilesPage' element={<UserFilesPage type='PERSONAL' />} />
//                         <Route path='publicPage' element={<UserFilesPage type='PUBLIC' />} />

//                     </Routes>
//                 </div>
//             </div>
//         </BrowserRouter>
//     );
// };

// export default RoutesComponent;

import {  Navigate } from 'react-router-dom';

const RoutesComponent = () => {
    const isLoggedIn = getCookie("auth_token")!="";  // שים כאן את הלוגיקה שלך כדי לבדוק אם המשתמש מחובר

    return (
        <BrowserRouter>
            <div style={{ display: 'flex' }}>
                {/* רק אם המשתמש מחובר, הצג את ה-Sidebar */}
                {isLoggedIn ? (
                    <>
                        <Sidebar />
                        <div style={{ flex: 1, padding: '20px' }}>
                            <Routes>
                                <Route path='upload' element={<FileUpload />} />
                                <Route path='userFilesPage' element={<UserFilesPage type='PERSONAL' />} />
                                <Route path='publicPage' element={<UserFilesPage type='PUBLIC' />} />
                                <Route path='*' element={<Navigate to='upload' />} /> {/* ניווט לברירת המחדל */}
                            </Routes>
                        </div>
                    </>
                ) : (
                    <Routes>
                        {/* הצג את ה-Login אם המשתמש לא מחובר */}
                        <Route path='/' element={<Login />} />
                        <Route path='*' element={<Navigate to='/' />} /> {/* ניווט לעמוד הבית אם אין הרשאה */}
                    </Routes>
                )}
            </div>
        </BrowserRouter>
    );
};

export default RoutesComponent;

