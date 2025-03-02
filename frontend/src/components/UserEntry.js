import "../styles/UserEntry.css"

const UserEntry = ({user, onEdit, onDelete}) => {
    return (
        <div className="user-entry">
            <div className="user-info">
                <p>{user.username}</p>
                <p>{user.role}</p>
            </div>
            <div className="user-actions">
                <button className="edit-button" onClick={() => onEdit(user.id)}>Edit</button>
                <button className="delete-button" onClick={() => onDelete(user.id)}>Delete</button>
            </div>
        </div>
    );
};

export default UserEntry;   