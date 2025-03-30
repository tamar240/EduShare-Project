// import { useEffect } from 'react';
// import { Navigate } from 'react-router-dom';
// import { getCookie } from './login/Login';


// const WelcomePage = () => {
//      const isLoggedIn = getCookie("auth_token") !== "";  // לוגיקת הבדיקה אם המשתמש מחובר

//     useEffect(() => {
//         // אם המשתמש מחובר, נוודא שהוא יועבר לעמוד הבית
//         if (isLoggedIn) {
//             window.location.href = "/userFilesPage"; // ניווט לעמוד הבית (או עמוד שאתה רוצה)
//         }
//     }, [isLoggedIn]);

//     return isLoggedIn ? <Navigate to='/home' /> : <Navigate to='/login' />;
// };

// export default WelcomePage;
