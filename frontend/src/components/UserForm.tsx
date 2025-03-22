import { User } from "../types/user.types.ts";
import { useEffect, useState } from "react";
import {
    TextField,
    Button,
    MenuItem,
    SelectChangeEvent, Dialog, DialogTitle, DialogContent, Box, Alert
} from '@mui/material';

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
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
        <Dialog open={true} onClose={onCancel} fullWidth maxWidth="sm">
            <DialogTitle>{isEditing ? "Edit User" : "Add New User"}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
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
                    <TextField
                        fullWidth
                        select
                        label="Role"
                        name="role"
                        value={formState.role}
                        onChange={handleChange}
                        margin="normal"
                        required
                    >
                        {roles.map((r) => (
                            <MenuItem key={r} value={r}>{r}</MenuItem>
                        ))}
                    </TextField>
                    {error && <Alert severity="error">{error}</Alert>}
                    <Box sx={{display: "flex", justifyContent: "flex-end", gap: 2, mt: 2}}>
                        <Button variant="outlined" onClick={onCancel}>Cancel</Button>
                        <Button variant="contained" color="primary"
                                type="submit">{isEditing ? "Update" : "Add"}</Button>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UserForm;
