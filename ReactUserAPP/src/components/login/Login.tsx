import { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';



export const isLogin=()=>{
const token = getCookie("auth_token");
return token!=""
}
export const getCookie = (name: string) => {

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || '';
    }
    return '';
}


export const getUserDetailes = () => {
    const token = getCookie("auth_token");
    if (token) {
        const decodedToken: any = jwtDecode(token);

        console.log("de token", decodedToken);

        return {
            name: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
            id: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
            role: decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
        };
    }
    return null;
};

export const removeCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
const Login = () => {
    const resetForm = () => {
        setName('');
        setPassword('');
        setEmail('');
        setError('');
        setStatus('login');
    };

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [status, setStatus] = useState('login');
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const baseUrl = import.meta.env.VITE_API_URL;
    
    const navigate = useNavigate();

    const urlAuthAPI = `${baseUrl}/api/Auth/`;

    const handleLogin = async (e: any) => {

        e.preventDefault();
        setIsLoading(true); // בתחילת הפעולה

        const loginData = { name, password };

        try {
            const response = await axios.post(`${urlAuthAPI}${status}`, loginData);
            const { token } = response.data;
            document.cookie = `auth_token=${token}; path=/; secure; samesite=strict;`;
            console.log("Login successful", getCookie("auth_token"));
            setOpen(false);
            resetForm();
            navigate('/userFilesPage', { state: { type: 'PERSONAL' } });

        } catch (error) {
            setError('שם משתמש או סיסמה לא נכונים');
        }
        finally{
            setIsLoading(false);
        }
    };
    const handleRegister = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);

        const registerData = { name, password, email, roleName: "Teacher" };

        try {
            const response = await axios.post(`${urlAuthAPI}${status}`, registerData);

            const { token } = response.data;
            document.cookie = `auth_token=${token}; path=/; secure; samesite=strict;`;

            console.log("Registration successful", getCookie("auth_token"));

            setOpen(false);
            resetForm();
            navigate('/userFilesPage');

        } catch (error) {
            setError('הרשמה נכשלה, נסה שנית');
        }
        finally{
            setIsLoading(false);
        }
    };

    const LoadingAnimation = () => (
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1rem",
        }}>
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
          <style>
            {`
              .dot {
                width: 10px;
                height: 10px;
                margin: 0 5px;
                background-color: #3f51b5;
                border-radius: 50%;
                animation: bounce 0.8s infinite ease-in-out;
                z-index: 100;
              }
      
              .dot:nth-child(2) {
                animation-delay: 0.8s;
              }
      
              .dot:nth-child(3) {
                animation-delay: 0.12s;
              }
      
              @keyframes bounce {
                0%, 80%, 100% {
                  transform: scale(0);
                } 40% {
                  transform: scale(1);
                }
              }
            `}
          </style>
        </div>
      );
      
    return (
        <div>
            <Button variant="contained" onClick={() => setOpen(true)}>התחבר</Button>
            <Dialog open={open} onClose={() => setOpen(false)}  dir="rtl">
                <DialogTitle>התחבר</DialogTitle>
                <DialogContent sx={{ textAlign: 'right' }}>
                    <TextField
                        fullWidth
                        label="שם משתמש"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        margin="dense"
                        
                    />
                    {status === 'register' &&
                        <TextField
                            fullWidth
                            label="מייל"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="dense"
                            
                        />
                    }
                    <TextField
                        fullWidth
                        label="סיסמה"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="dense"
                    />
                    {status == "login" &&
                        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                            אין לך חשבון?{" "}
                            <Button variant="text" size="small" onClick={() => setStatus("register")}>
                                הרשם
                            </Button>
                        </Typography>
                    }
                    {error && <Typography color="error">{error}</Typography>}

                </DialogContent>  
                  {isLoading && <LoadingAnimation />}
                <DialogActions>
                    <Button onClick={() => { setOpen(false); resetForm() }}>סגור</Button>
                    <Button variant="contained" onClick={status === "login" ? handleLogin : handleRegister}>
                        {status === "login" ? "התחבר" : "הרשם"}
                    </Button>
                     
                </DialogActions>
            </Dialog>
    
        </div>
     

    );
};

export default Login;
