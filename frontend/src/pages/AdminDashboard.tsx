import {useNavigate} from "react-router-dom";
import UserList from "../components/UserList";
import React from "react";
import styles from "../styles/AdminDashboard.module.css"

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("userRole");
        navigate("/");
    };

    return (
        <div className={styles.adminDashboard}>
            <h1>Admin Dashboard</h1>
            <div className="dashboardBody">
                <UserList/>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default AdminDashboard;
