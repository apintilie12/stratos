import './styles/App.css';
import './styles/global.css';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard'
import LoginPage from './pages/LoginPage'

export default function App() {
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
