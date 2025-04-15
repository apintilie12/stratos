import { useEffect, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Container,
    TextField,
    Typography,
    Alert
} from "@mui/material";
import { AuthService } from "../services/AuthService.ts";
import { useNavigate } from "react-router-dom";

interface SetupOTPPageProps {
    username: string;
}

const SetupOTPPage: React.FC<SetupOTPPageProps> = ({ username }) => {
    const [error, setError] = useState<string>("");
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [code, setCode] = useState<string>("");
    const [verifying, setVerifying] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        AuthService.enableOTP(username)
            .then(setQrCode)
            .catch(() => setError("Failed to fetch QR code."));
    }, []);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setVerifying(true);
        setError("");
        try {
            await AuthService.verifyOTP(username, code);
            setSuccess(true);
            setTimeout(() => {
                navigate("/"); // or redirect to user dashboard
            }, 1500);
        } catch (err) {
            setError("Invalid code. Please try again.");
            console.log(err)
        } finally {
            setVerifying(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    mt: 8,
                    p: 4,
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    boxShadow: 2,
                    textAlign: "center",
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Set up Two-Factor Authentication
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Scan the QR code with Google Authenticator, then enter the 6-digit code below
                </Typography>

                {qrCode ? (
                    <Box
                        component="img"
                        src={`data:image/png;base64,${qrCode}`}
                        alt="OTP QR Code"
                        sx={{
                            width: 250,
                            height: 250,
                            marginBottom: 3,
                            border: "1px solid #ccc",
                            borderRadius: 1,
                        }}
                    />
                ) : (
                    <CircularProgress sx={{ mb: 3 }} />
                )}

                <form onSubmit={handleVerify}>
                    <TextField
                        label="6-digit code"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        disabled={!qrCode || verifying}
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 6 }}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                        disabled={!code || verifying}
                    >
                        {verifying ? "Verifying..." : "Verify Code"}
                    </Button>
                </form>

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        OTP setup complete! Redirecting...
                    </Alert>
                )}
            </Box>
        </Container>
    );
};

export default SetupOTPPage;
