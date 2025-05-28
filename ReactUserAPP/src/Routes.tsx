import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login, {  isLogin } from './components/login/Login';
import FileUpload from './components/file/FileUploader';
import './App.css';
import UserFilesPage from './components/pages/UserFilesPage';
import Header from './components/parts/Header';
import Footer from './components/parts/Footer';
import Homepage from './components/pages/HomePage';
import UserFileGallery from './components/pages/UserFileGallery';
import LessonDisplay from './components/foldersAndFilesPage/LessonDisplay';
import LessonsList from './components/foldersAndFilesPage/LessonsList';
import RecycleBin from './components/pages/RecycleBin';
import SubjectsPage from './components/pages/SubjectsPage';
import LessonsPage from './components/pages/LessonsPage';
import LessonDisplayPage from './components/pages/LessonDisplayPage';
import UserProfile from './components/pages/UserProfile';
import Sidebar from './components/parts/Sidebar';
// import LessonCard from './components/foldersAndFilesPage/LessonCard';

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

    return (
        <BrowserRouter>
            <div id="root" className="page-container">
                {isUserLoggedIn && <Header />}
                <div className="content">
                    <div style={{ display: 'flex', flexDirection: 'row-reverse', flex: 1, padding: '20px' }}>
                        {isUserLoggedIn && <Sidebar />}
                        <div style={{ flex: 1 }}>
                            <Routes>
                                {!isUserLoggedIn && <Route path='/' element={<Homepage />} />}
                                <Route path='login' element={<Login />} />
                                <Route path='profile' element={<UserProfile />} />
                                <Route path='upload' element={<FileUpload />} />
                                <Route path='recycleBin' element={<RecycleBin />} />
                                <Route path='userFilesPage' element={<UserFilesPage type='PERSONAL' />} />
                                <Route path='publicPage' element={<UserFilesPage type='PUBLIC' />} />
                                <Route path="/myFiles" element={<UserFileGallery />} />
                                <Route path="/lessonDisplay" element={<LessonDisplay lesson={{
                                    id: 0,
                                    name: '',
                                    createdAt: '',
                                    updatedAt: '',
                                    subjectId: 0,
                                    ownerId: 0,
                                    permission: 0,
                                    originalSummary: undefined,
                                    orginalSummaryId: 0,
                                    processedSummary: undefined,
                                    processedSummaryId: 0
                                }} subjectId={0} onGoBack={function (): void {
                                    throw new Error('Function not implemented.');
                                } } />} />
                                <Route path="/lessonList/:subjectId" element={<LessonsList selectedSubjectLessons={null} subjectId={0} type={'PERSONAL'} />} />
                                <Route path="/subjects" element={<SubjectsPage />} />

{/* Lessons list for a specific subject */}
<Route path="/subjects/:subjectId/lessons" element={<LessonsPage />} />

{/* Specific lesson content */}
<Route path="/subjects/:subjectId/lessons/:lessonId" element={<LessonDisplayPage />} />
                                {/* <Route path="/singleLesson" element={<LessonCard id={0} name={''} createdAt={''} updatedAt={''} subjectId={0} ownerId={0} permission={0} />} /> */}
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