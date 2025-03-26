import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/login/Login';
import FileUpload from './components/file/FileUploader';
import UserFilesPage from './components/UserFilesPage';
import PublicPage from './components/guestPage/PublicPage';
import Sidebar from './components/Sidebar';
import './App.css'; // Assuming you have a CSS file for styling

const RoutesComponent: React.FC = () => {
    return (
        <BrowserRouter>
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '20px' }}>
                    <Routes>
                        <Route path='/' element={<Login />} />
                        <Route path='upload' element={<FileUpload />} />
                        <Route path='userFilesPage' element={<UserFilesPage />} />
                        <Route path='publicPage' element={<PublicPage />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default RoutesComponent;


