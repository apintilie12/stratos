import { useNavigate } from "react-router-dom";
import UserList from "../components/UserList";

const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("userRole");
        navigate("/");
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Admin Dashboard</h1>
            </header>
            <div className="App-body">
                <div className="App-intro">
                    <UserList />
                </div>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default AdminDashboard;
