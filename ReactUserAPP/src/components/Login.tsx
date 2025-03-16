import { useState } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';

const Login = () => {

    function getCookie(name: string) {

        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);

        if (parts.length === 2) {
            return parts.pop()?.split(';').shift() || '';
        }
        return '';
    }

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

    const urlAuthAPI = "https://localhost:7249/api/Auth/";

    const handleLogin = async (e: any) => {

        e.preventDefault();

        const loginData = { name, password };

        try {
            const response = await axios.post(`${urlAuthAPI}${status}`, loginData);
            const { token } = response.data;
            document.cookie = `auth_token=${token}; path=/; secure; samesite=strict;`;
            console.log("Login successful", getCookie("auth_token"));
            setOpen(false);
            resetForm();
        } catch (error) {
            setError('שם משתמש או סיסמה לא נכונים');
        }
    };
    const handleRegister = async (e: any) => {
        e.preventDefault();

        const registerData = { name, password, email, roleName: "Admin" };

        try {
            const response = await axios.post(`${urlAuthAPI}${status}`, registerData);
            const { token } = response.data;
            document.cookie = `auth_token=${token}; path=/; secure; samesite=strict;`;
            console.log("Registration successful", getCookie("auth_token"));

            setOpen(false);
            resetForm();
        } catch (error) {
            setError('הרשמה נכשלה, נסה שנית');
        }
    };

    return (
        <div>
            <Button variant="contained" onClick={() => setOpen(true)}>התחבר</Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>התחבר</DialogTitle>
                <DialogContent>
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
