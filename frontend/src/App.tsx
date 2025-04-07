import './App.css'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import {CssBaseline, ThemeProvider} from "@mui/material";
import theme from "./styles/theme.ts"
// import MaintenanceRecordEntry from "./components/MaintenanceRecordEntry.tsx";
// import {MaintenanceRecord} from "./types/maintenanceRecord.types.ts";
// import dayjs from "dayjs";
import MaintenanceRecordList from "./components/MaintenanceRecordList.tsx";


function App() {

    // const sampleMaintenanceRecord: MaintenanceRecord = {
    //     id: "9f3a1a2c-45b2-4d5f-89fa-123456789abc",
    //     aircraft: {registrationNumber:"YR-ABC", type:"", status:""},
    //     engineer: {id:"e872a6b9-215d-48d2-a2ee-abcdef123456", password:"", role:"ENGINEER", username:""},
    //     type: "INSPECTION",
    //     startDate: dayjs("2025-04-07T08:00:00Z"),
    //     endDate: dayjs("2025-04-07T12:00:00Z"),
    //     status: "IN_PROGRESS"
    // };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Navigate to="/login"/>}/>
                    <Route path='/login' element={<LoginPage/>}/>
                    <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
                    <Route path='/engineer/dashboard/:userId' element={<MaintenanceRecordList/>}/>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>

    )
}

export default App
