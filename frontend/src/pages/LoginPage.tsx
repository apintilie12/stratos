import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {TextField, Button, Typography, Container, Paper, Alert, useTheme} from "@mui/material";
import {User} from "../types/user.types.ts"
import {AuthService} from "../services/AuthService.ts";

interface LoginResponse {
    user: User;
    token: string;
}

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    const theme = useTheme();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const loginResponse: LoginResponse = await AuthService.login(username, password);
            localStorage.setItem("userRole", loginResponse.user.role);
            sessionStorage.setItem("token", loginResponse.token);
            console.log("User:" + loginResponse.user.username + " otp enabled?: " + loginResponse.user.isOtpEnabled);
            if (!loginResponse.user.isOtpEnabled) {
                navigate('/enable-otp', {state: {username}});
                return;
            }
            switch (loginResponse.user.role) {
                case "ADMIN":
                    navigate("/admin/dashboard");
                    break;
                case "ENGINEER":
                    navigate(`/engineer/dashboard/${loginResponse.user.id}`);
                    break;
                case "PILOT":
                    setError("Login as PILOT");
                    break;
                default:
                    setError("Unknown role, please contact support");
            }
        } catch (error) {
            setError("Login failed, please try again");
            console.log(error);
        }
    };

    return (
        <Container maxWidth="xs" sx={{mt: 8}}>
            <Paper elevation={3}
                   sx={{p: 4, textAlign: "center", backgroundColor: theme.palette.background.paper, borderRadius: 4}}>
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <Alert severity="error" sx={{mt: 2}}>{error}</Alert>}
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{mt: 3}}>
                        Login
                    </Button>
                    <Button
                        onClick={() => navigate('/forgot-password')}
                        variant="text"
                        color="primary"
                        fullWidth
                        sx={{mt: 1, textTransform: 'none'}}
                    >
                        Forgot password?
                    </Button>

                </form>
            </Paper>
        </Container>
    );
};

export default LoginPage;
