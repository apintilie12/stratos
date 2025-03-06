import './App.css'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import LoginPage from "./pages/LoginPage.tsx";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Navigate to="/login"/>}/>
                <Route path='/login' element={<LoginPage/>}/>
                <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
