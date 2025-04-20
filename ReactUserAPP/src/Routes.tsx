import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login, { getCookie, isLogin } from './components/login/Login';
import FileUpload from './components/file/FileUploader';
import Sidebar from './components/parts/Sidebar';
import './App.css';
import UserFilesPage from './components/UserFilesPage';
import Header from './components/parts/Header';
import Footer from './components/parts/Footer';
import Homepage from './components/HomePage';
import UserFileGallery from './components/UserFileGallery';

const RoutesComponent: React.FC = () => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(isLogin());
    // const [userId, setUserId] = useState<number>(4);

    // אם הפונקציה isLogin() משנה את מצב התחברות המשתמש, עדכן את הסטייט
    useEffect(() => {
        const loginCheckInterval = setInterval(() => {
            setIsUserLoggedIn(isLogin());
        }, 500); // כל שנייה בודק אם המשתמש מחובר

        return () => clearInterval(loginCheckInterval); // לנקות את ה-interval אם הקומפוננטה לא מוצגת
    }, []);

    // if (isUserLoggedIn) {
    //     const token = getCookie('auth_token');
    //     setUserId(Number(token)); // עדכון הסטייט עם ה-userId
    //     // debugger
    // }
    return (
        // <BrowserRouter>
        //     <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        //         {isUserLoggedIn && <Header />}
        //         <div style={{ display: 'flex', flex: 1, padding: '20px' }}>
        //             {isUserLoggedIn && <Sidebar />}
        //             <div style={{ flex: 1 }}>
        //                 <Routes>
        //                     {!isUserLoggedIn && <Route path='/' element={<Homepage />} />}
        //                     <Route path='login' element={<Login />} />
        //                     <Route path='upload' element={<FileUpload />} />
        //                     <Route path='userFilesPage' element={<UserFilesPage type='PERSONAL' />} />
        //                     <Route path='publicPage' element={<UserFilesPage type='PUBLIC' />} />
        //                     <Route path="/myFiles" element={<UserFileGallery userId={4} />} />
        //                 </Routes>
        //             </div>
        //         </div>
        //         {isUserLoggedIn && <Footer />}
        //     </div>
        // </BrowserRouter>
        <BrowserRouter>
  <div id="root" className="page-container">
    {isUserLoggedIn && <Header />}
    <div className="content">
      <div style={{ display: 'flex', flex: 1, padding: '20px' }}>
        {isUserLoggedIn && <Sidebar />}
        <div style={{ flex: 1 }}>
          <Routes>
            {!isUserLoggedIn && <Route path='/' element={<Homepage />} />}
            <Route path='login' element={<Login />} />
            <Route path='upload' element={<FileUpload />} />
            <Route path='userFilesPage' element={<UserFilesPage type='PERSONAL' />} />
            <Route path='publicPage' element={<UserFilesPage type='PUBLIC' />} />
            <Route path="/myFiles" element={<UserFileGallery userId={4} />} />
          </Routes>
        </div>
      </div>
    </div>
    {isUserLoggedIn && <Footer />}
  </div>
</BrowserRouter>

    );
};

export default RoutesComponent;
