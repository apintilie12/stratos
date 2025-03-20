import { useNavigate } from "react-router-dom";
import UserList from "../components/UserList";
import { Container, Typography, Box, Button } from "@mui/material";

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("userRole");
        navigate("/");
    };

    return (
        <Container maxWidth={false} sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Admin Dashboard
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center", width: "100%", height: "80%" }}>
                <UserList />

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleLogout}
                    sx={{ mt: 2, borderRadius: 2 }}
                >
                    Logout
                </Button>
            </Box>
        </Container>
    );
};

export default AdminDashboard;
