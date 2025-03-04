import {useState } from "react"
import styles from '../styles/LoginPage.module.css'
import { useNavigate } from "react-router-dom";


const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const apiURL = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiURL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({username, password}),
            })

            const data = await response.json();
            if(response.ok) {
                const role = data;
                localStorage.setItem("userRole", role);

                if(role === "ADMIN") {
                    navigate("/admin/dashboard");
                } else if(role === "ENGINEER") {
                    setError("Login as ENGINEER");
                } else if(role === "PILOT") {
                    setError("Login as PILOT");
                } else {
                    setError("Unknown role, please contact support");
                }
            } else {
                setError(data);
            }
        } catch (error) {
            setError("Login failed, please try again");
        }
    }

    return (
        <div className={styles["container"]}>
            <div className={styles["login-container"]}>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className={styles["form-group"]}>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        required
                    />
                    </div>
                    <div className={styles["form-group"]}>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                    </div>
                    {error && <div className="form-group error-message">{error}</div>}
                    <button className={styles.button} type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage;