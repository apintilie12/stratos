import {User} from "../types/user.types.ts";
import {useEffect, useState} from "react";
import styles from "../styles/UserForm.module.css"


interface UserFormProps {
    initialUser?: User;
    onSave: (user: User) => void;
    onCancel: () => void;
    isEditing: boolean;
}

const UserForm: React.FC<UserFormProps> = ({initialUser, onSave, onCancel, isEditing}) => {
    const defaultUser: User = {username: "", password: "", role: ""};
    const [formState, setFormState] = useState<User>(initialUser || defaultUser);
    const [roles, setRoles] = useState<string[]>([]);
    const [confirmPasswordValue, setConfirmPasswordValue] = useState<string>(initialUser?.password || '');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchRoles = async () => {
            const apiURL = import.meta.env.VITE_APP_API_URL;
            const response = await fetch(`${apiURL}/users/roles`);
            const data = await response.json();
            setRoles(data);
        }

        fetchRoles();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        if (name === "confirmPassword") {
            setConfirmPasswordValue(value);
        } else {
            setFormState({...formState, [name]: value});
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formState.password !== confirmPasswordValue) {
            setError("Passwords do not match!");
            return;
        }
        setError("");
        onSave(formState);
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content user-form">
                <h2>{isEditing ? "Edit User" : "Add New User"}</h2>
                <form className={styles.userForm} onSubmit={handleSubmit}>
                    <label className={styles.label}>
                        <span className={styles.span}>Username:</span>
                        <input
                            className={styles.input}
                            type="text"
                            name="username"
                            value={formState.username}
                            onChange={handleChange}
                            placeholder={isEditing ? "" : "Enter username"}
                            required
                        />
                    </label>
                    <label className={styles.label}>
                        <span className={styles.span}>Password:</span>
                        <input
                            className={styles.input}
                            type="password"
                            name="password"
                            value={formState.password}
                            onChange={handleChange}
                            placeholder={isEditing ? "" : "Enter password"}
                            required={!isEditing}
                        />
                    </label>
                    <label className={styles.label}>
                        <span className={styles.span}>Confirm Password:</span>
                        <input
                            className={styles.input}
                            type="password"
                            name="confirmPassword"
                            value={confirmPasswordValue}
                            onChange={handleChange}
                            placeholder={isEditing ? "" : "Confirm password"}
                            required={!isEditing}
                        />
                    </label>
                    {error &&
                        <label className={styles.label}>
                            <span className="placeholder"></span>
                            <p className={styles.errorMessage}>{error}</p>
                        </label>}
                    <label className={styles.label}>
                        <span className={styles.span}>Role:</span>
                        <select
                            className={styles.select}
                            name="role"
                            value={formState.role}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select a role</option>
                            {roles.map(role => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    </label>
                    <div className="form-buttons">
                        <button type="submit" className="positive button">{isEditing ? "Save" : "Create User"}</button>
                        <button type="button" className="negative button" onClick={onCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );

}

export default UserForm;