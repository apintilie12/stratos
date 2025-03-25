import {useNavigate} from "react-router-dom";
import UserList from "../components/UserList";
import {
    Container,
    Typography,
    Box,
    Drawer,
    List,
    ListItemText,
    IconButton,
    ListItemButton,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import {useState} from "react";
import AircraftList from "../components/AircraftList.tsx";
import FlightList from "../components/FlightList.tsx";

const AdminDashboard: React.FC = () => {
    const [selectedSection, setSelectedSection] = useState<string>("users");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("userRole");
        navigate("/");
    };

    const handleSectionSelect = (section: string) => {
        setSelectedSection(section);
    };

    return (
        <Box sx={{display: "flex", width: "100%", height: "90vh", alignItems: "flex-start"}}>
            <Drawer
                sx={{
                    width: 200,
                    display: "flex",
                    flexDirection: "column",
                    "& .MuiDrawer-paper": {
                        width: 200,
                        boxSizing: "border-box",
                    },
                }}
                variant="persistent"
                anchor="left"
                open={true}
            >
                <List sx={{flexGrow: 1}}>
                    <ListItemButton
                        onClick={() => handleSectionSelect("users")}
                        sx={{
                            backgroundColor: selectedSection === "users" ? "rgba(0, 123, 255, 0.2)" : "transparent",
                            "&:hover": {
                                backgroundColor: selectedSection === "users" ? "rgba(0, 123, 255, 0.3)" : "rgba(0, 0, 0, 0.08)",
                            },
                        }}
                    >
                        <ListItemText primary="Users"/>
                    </ListItemButton>
                    <ListItemButton
                        onClick={() => handleSectionSelect("aircraft")}
                        sx={{
                            backgroundColor: selectedSection === "aircraft" ? "rgba(0, 123, 255, 0.2)" : "transparent",
                            "&:hover": {
                                backgroundColor: selectedSection === "aircraft" ? "rgba(0, 123, 255, 0.3)" : "rgba(0, 0, 0, 0.08)",
                            },
                        }}
                    >
                        <ListItemText primary="Aircraft"/>
                    </ListItemButton>
                    <ListItemButton
                        onClick={() => handleSectionSelect("flights")}
                        sx={{
                            backgroundColor: selectedSection === "flights" ? "rgba(0, 123, 255, 0.2)" : "transparent",
                            "&:hover": {
                                backgroundColor: selectedSection === "flights" ? "rgba(0, 123, 255, 0.3)" : "rgba(0, 0, 0, 0.08)",
                            },
                        }}
                    >
                        <ListItemText primary="Flights"/>
                    </ListItemButton>
                </List>

                <Box sx={{marginTop: "auto", padding: 2}}>
                    <IconButton color="secondary" onClick={handleLogout}>
                        <ExitToAppIcon/>
                        <ListItemText primary="Logout" sx={{marginLeft: 1}}/>
                    </IconButton>
                </Box>
            </Drawer>

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
                            Admin Dashboard
                        </Typography>
                    </Box>

                    <Box sx={{flexGrow: 1, width: "100%"}}>
                        {selectedSection === "users" && <UserList/>}
                        {selectedSection === "aircraft" && <AircraftList/>}
                        {selectedSection === "flights" && <FlightList/>}
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
