import {useState} from "react";
import styles from "../styles/LoginPage.module.css";
import {useNavigate} from "react-router-dom";

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const apiURL = import.meta.env.VITE_APP_API_URL;
            const response = await fetch(`${apiURL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({username, password}),
            });

            const data: string = await response.json();
            if (response.ok) {
                localStorage.setItem("userRole", data);

                switch (data) {
                    case "ADMIN":
                        navigate("/admin/dashboard");
                        break;
                    case "ENGINEER":
                        setError("Login as ENGINEER");
                        break;
                    case "PILOT":
                        setError("Login as PILOT");
                        break;
                    default:
                        setError("Unknown role, please contact support");
                }
            } else {
                setError(data);
            }
        } catch (error) {
            setError("Login failed, please try again");
            console.log(error);
        }
    };

    return (
        <div className={styles.container}>
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
    );
};

export default LoginPage;
