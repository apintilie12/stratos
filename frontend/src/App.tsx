import './App.css'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import {CssBaseline, ThemeProvider} from "@mui/material";
import theme from "./styles/theme.ts"


function App() {

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Navigate to="/login"/>}/>
                    <Route path='/login' element={<LoginPage/>}/>
                    <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>

    )
}

export default App
