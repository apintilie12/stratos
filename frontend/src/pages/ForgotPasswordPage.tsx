import {useState} from "react";
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Alert
} from "@mui/material";
import {AuthService} from "../services/AuthService.ts";
import {useNavigate} from "react-router-dom";

const ForgotPasswordPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [code, setCode] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleVerify = async () => {
        try {
            const response = await AuthService.verifyOTPReset(username, code);
            setIsVerified(true);
            setError("");
            sessionStorage.setItem("token", response.data.token);
        } catch (e) {
            setError("Invalid code or username.");
            console.log(e);
        }
    };

    const handleReset = async () => {
        if (!newPassword) {
            setError("Please enter a non-empty password.");
            return;
        }
        if(newPassword !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        try {
            await AuthService.resetPassword(username, newPassword);
            setSuccess("Password successfully reset. Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (e) {
            setError("Failed to reset password.");
            console.log(e);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{mt: 8, p: 4, boxShadow: 2, borderRadius: 2}}>
                <Typography variant="h5" gutterBottom>Forgot Password</Typography>

                {!isVerified ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }}>
                        <TextField
                            fullWidth
                            label="Username"
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="Authenticator Code"
                            margin="normal"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <Button fullWidth variant="contained" type="submit">
                            Verify Code
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={(e) => { e.preventDefault(); handleReset(); }}>
                        <TextField
                            fullWidth
                            label="New Password"
                            type="password"
                            margin="normal"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="Confirm New Password"
                            type="password"
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Button fullWidth variant="contained" type="submit">
                            Reset Password
                        </Button>
                    </form>
                )}


                {error && <Alert severity="error" sx={{mt: 2}}>{error}</Alert>}
                {success && <Alert severity="success" sx={{mt: 2}}>{success}</Alert>}

            </Box>
        </Container>
    );
};

export default ForgotPasswordPage;
