import './App.css'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import {CssBaseline, ThemeProvider} from "@mui/material";
import theme from "./styles/theme.ts"
import EngineerDashboard from "./pages/EngineerDashboard.tsx";
import AuthenticatedRouteGuard from './utils/AuthenticatedRouteGuard.tsx';
import SetupOTPPageWrapper from "./utils/SetupOTPPageWrapper.tsx";


function App() {

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Navigate to="/login"/>}/>
                    <Route path='/login' element={<LoginPage/>}/>
                    <Route element={<AuthenticatedRouteGuard requiredRole="ANY"/>}>
                        <Route path='/enable-otp' element={<SetupOTPPageWrapper />}/>
                    </Route>
                    <Route element={<AuthenticatedRouteGuard requiredRole="ADMIN"/>}>
                        <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
                    </Route>
                    <Route element={<AuthenticatedRouteGuard requiredRole="ENGINEER"/>}>
                        <Route path='/engineer/dashboard/:userId' element={<EngineerDashboard/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>

    )
}

export default App
