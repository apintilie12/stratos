import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {TextField, Button, Typography, Container, Paper, Alert, useTheme} from "@mui/material";
import {User} from "../types/user.types.ts"

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    const theme = useTheme();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const apiURL = import.meta.env.VITE_APP_API_URL;
            const response = await fetch(`${apiURL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({username, password}),
            });

            const user: User = await response.json();
            if (response.ok) {
                localStorage.setItem("userRole", user.role);

                switch (user.role) {
                    case "ADMIN":
                        navigate("/admin/dashboard");
                        break;
                    case "ENGINEER":
                        navigate(`/engineer/dashboard/${user.id}`);
                        break;
                    case "PILOT":
                        setError("Login as PILOT");
                        break;
                    default:
                        setError("Unknown role, please contact support");
                }
            } else {
                setError("Unknown error");
            }
        } catch (error) {
            setError("Login failed, please try again");
            console.log(error);
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center", backgroundColor: theme.palette.background.paper, borderRadius: 4 }}>
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
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
                    Login
                </Button>
            </form>
        </Paper>
    </Container>
);
};

export default LoginPage;
