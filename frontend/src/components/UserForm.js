import {useEffect, useState } from "react"
import "../styles/UserForm.css"

const UserForm = ({initialUser = {}, onSave, onCancel, isEditing = false}) => {
    const [formData, setFormData] = useState(initialUser);
    const [roles, setRoles] = useState([]);
    const [confirmPasswordValue, setConfirmPasswordValue] = useState(initialUser.password);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRoles = async () => {
            const apiURL = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiURL}/users/roles`);
            const data = await response.json();
            setRoles(data);
        }

        fetchRoles();
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;
        if(name === "confirmPassword") {
            setConfirmPasswordValue(value);
        } else {
            setFormData({ ...formData, [name]: value});
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(formData.password !== confirmPasswordValue) {
            setError("Passwords do not match!");
            return;
        }
        setError("");
        onSave(formData);
    }

    return (
        <div className="user-form">
            <h3>{isEditing ? "Edit User" : "Add New User"}</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Username:</span>
                    <input
                        type="text"
                        name="username"
                        value={formData.username || ""}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    <span>Password:</span>
                    <input
                        type="text"
                        name="password"
                        value={formData.password || ""}
                        onChange={handleChange}
                        placeholder={isEditing ? "": "Enter password"}
                        required={!isEditing}
                    />
                </label>
                <label>
                    <span>Confirm Password:</span>
                    <input
                        type="text"
                        name="confirmPassword"
                        value={confirmPasswordValue || ""}
                        onChange={handleChange}
                        placeholder={isEditing ? "": "Confirm password"}
                        required={!isEditing}
                    />
                </label>
                {error && 
                    <label>
                        <span className="placeholder"></span>
                        <p className="error-message">{error}</p>
                    </label>}
                <label>
                    <span>Role:</span>
                    <select
                        name="role"
                        value={formData.role || ""}
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
                    <button type="submit">{isEditing ? "Save" : "Create User"}</button>
                    <button type="button" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default UserForm;