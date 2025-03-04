import {useState } from "react"
import styles from '../styles/LoginPage.module.css'


const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Username: ", username);
        console.log("Password: ", password);
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
                    <button className={styles.button} type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage;