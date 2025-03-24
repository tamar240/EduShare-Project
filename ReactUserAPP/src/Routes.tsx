import React from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import FileUpload from './components/FileUploader';
import UserFilesPage from './components/UserFilesPage';
// import PublicPage from './components/PublicPage';



const RoutesComponent: React.FC = () => {
    return (
        <BrowserRouter>
            {/* <Header /> */}
            {/* <Outlet/> */}
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='upload' element={< FileUpload/>} />
                {/* <Route path='/' element={< FileUpload/>} /> */}
                <Route path='userFilesPage' element={< UserFilesPage/>} />
                {/* <Route path='publicPage' element={< PublicPage/>} /> */}
            </Routes>
        </BrowserRouter>
    );
};

export default RoutesComponent;


