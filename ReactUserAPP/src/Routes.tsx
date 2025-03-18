import React from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import FileUpload from './components/FileUploader2';



const RoutesComponent: React.FC = () => {
    return (
        <BrowserRouter>
            {/* <Header /> */}
            <Outlet/>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/upload' element={< FileUpload/>} />
            </Routes>
        </BrowserRouter>
    );
};

export default RoutesComponent;


