import { useEffect, useState } from "react"
import "../styles/EditUserForm.css"

const EditUserForm = ({user, onSave, onCancel}) => {
    const [formData, setFormData] = useState(user);
    const [roles, setRoles] = useState([]);

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
        setFormData({ ...formData, [name]: value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    }

    return (
        <div className="edit-user-form">
            <h3>Edit User</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Username:</span>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    <span>Role:</span>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                    >
                       {roles.map(role => (
                        <option key={role} value={role}>
                            {role}
                        </option>
                       ))}
                    </select>
                </label>
                <div className="form-buttons">
                    <button type="submit">Save</button>
                    <button type="button" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default EditUserForm;