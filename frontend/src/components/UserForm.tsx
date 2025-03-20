import { User } from "../types/user.types.ts";
import { useEffect, useState } from "react";
import {
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    FormHelperText,
    SelectChangeEvent
} from '@mui/material';
import styles from "../styles/UserForm.module.css";

interface UserFormProps {
    initialUser?: User;
    onSave: (user: User) => void;
    onCancel: () => void;
    isEditing: boolean;
    apiError: string | null;
}

const UserForm: React.FC<UserFormProps> = ({ initialUser, onSave, onCancel, isEditing, apiError }) => {
    const defaultUser: User = { username: "", password: "", role: "" };
    const [formState, setFormState] = useState<User>(initialUser || defaultUser);
    const [roles, setRoles] = useState<string[]>([]);
    const [confirmPasswordValue, setConfirmPasswordValue] = useState<string>(initialUser?.password || '');
    const [error, setError] = useState<string | null>(apiError);

    useEffect(() => {
        const fetchRoles = async () => {
            const apiURL = import.meta.env.VITE_APP_API_URL;
            const response = await fetch(`${apiURL}/users/roles`);
            const data = await response.json();
            setRoles(data);
        };

        if (apiError === null) {
            fetchRoles();
            console.log("first render");
        }
        setError(apiError);
        console.log("Effect re-rendering:" + apiError);
    }, [apiError]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        if (name === "confirmPassword") {
            setConfirmPasswordValue(value);
        } else {
            setFormState({ ...formState, [name]: value });
        }
        setError(null);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formState.password !== confirmPasswordValue) {
            setError("Passwords do not match!");
            return;
        }
        console.log(formState);
        console.log(error);
        if (error !== null) {
            setError(apiError);
            return;
        }
        setError(null);
        onSave(formState);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content user-form">
                <h2>{isEditing ? "Edit User" : "Add New User"}</h2>
                <form className={styles.userForm} onSubmit={handleSubmit}>
                    <TextField
                        label="Username"
                        name="username"
                        value={formState.username}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                        placeholder={isEditing ? "" : "Enter username"}
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={formState.password}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        required={!isEditing}
                        margin="normal"
                        placeholder={isEditing ? "" : "Enter password"}
                    />
                    <TextField
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={confirmPasswordValue}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        required={!isEditing}
                        margin="normal"
                        placeholder={isEditing ? "" : "Confirm password"}
                    />
                    {error &&
                        <FormHelperText error>{error}</FormHelperText>}
                    <FormControl fullWidth margin="normal" required={!isEditing}>
                        <InputLabel>Role</InputLabel>
                        <Select
                            name="role"
                            value={formState.role}
                            onChange={handleChange}
                            label="Role"
                        >
                            <MenuItem value="" disabled>Select a role</MenuItem>
                            {roles.map(role => (
                                <MenuItem key={role} value={role}>
                                    {role}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <div className="form-buttons">
                        <Button type="submit" variant="contained" color="primary" className="positive button">
                            {isEditing ? "Save" : "Create User"}
                        </Button>
                        <Button type="button" variant="outlined" color="secondary" className="negative button" onClick={onCancel}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
