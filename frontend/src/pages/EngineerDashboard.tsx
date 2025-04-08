import React from "react";
import {Box, Typography, Container, IconButton, ListItemText} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MaintenanceRecordList from "../components/MaintenanceRecordList.tsx";


const EngineerDashboard: React.FC = () => {
    const { userId } = useParams<string>();
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate("/login");
    };

    return (
        <Box
            component="main"
            sx={{
                bgcolor: "background.default",
                p: 3,
                width: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Container maxWidth={false} sx={{flexGrow: 1, display: "flex", flexDirection: "column"}}>
                <Box sx={{width: "100%"}}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Engineer Dashboard
                    </Typography>
                </Box>

                <Box sx={{height: "600px"}}>
                    <MaintenanceRecordList engineerId={userId || ""}/>
                </Box>

                <Box sx={{marginTop: "auto", padding: 2}}>
                    <IconButton color="secondary" onClick={handleLogout}>
                        <ExitToAppIcon/>
                        <ListItemText primary="Logout" sx={{marginLeft: 1}}/>
                    </IconButton>
                </Box>

            </Container>
        </Box>
    );
};

export default EngineerDashboard;
