import {User} from "../types/user.types.ts"
import styles from "../styles/UserEntry.module.css"

interface UserEntryProps {
    user: User;
    onEdit: (id?: string) => void;
    onDelete: (id?: string) => void;
}

const UserEntry: React.FC<UserEntryProps> = ({user, onEdit, onDelete}) => {
    return (
        <div className={styles.userEntry}>
            <div className={styles.userInfo}>
                <p>{user.username}</p>
                <p>{user.role}</p>
            </div>
            <div className={styles.userActions}>
                <button className="edit button" onClick={() => onEdit(user.id)}>Edit</button>
                <button className="negative button" onClick={() => onDelete(user.id)}>Delete</button>
            </div>
        </div>
    );
};

export default UserEntry;