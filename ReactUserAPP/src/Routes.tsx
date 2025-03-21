import React from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import FileUpload from './components/FileUploader2';
import UserFilesPage from './components/UserFilesPage';



const RoutesComponent: React.FC = () => {
    return (
        <BrowserRouter>
            {/* <Header /> */}
            {/* <Outlet/> */}
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='upload' element={< FileUpload/>} />
                <Route path='userFilesPage' element={< UserFilesPage/>} />
            </Routes>
        </BrowserRouter>
    );
};

export default RoutesComponent;


