import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {User} from "../types/user.types.ts";
import UserEntry from "./UserEntry.tsx";
import styles from "../styles/UserList.module.css"
import UserForm from "./UserForm.tsx";
import ConfirmationModal from "./ConfirmationModal.tsx";

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isAddingUser, setIsAddingUser] = useState<boolean>(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const apiURL = import.meta.env.VITE_APP_API_URL;
                console.log(apiURL);
                const response = await fetch(`${apiURL}/users`);
                const body: User[] = await response.json();
                setUsers(body);
                setIsLoading(false);
            } catch (error) {
                let message = 'Unknown error';
                if (error instanceof Error) message = error.message;
                setError(message);
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = useCallback(async () => {
        try {
            if (!userToDelete) return;
            const apiURL = import.meta.env.VITE_APP_API_URL;
            const response = await fetch(`${apiURL}/users/${userToDelete.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete user");
            }

            setUsers((prevUsers) =>
                prevUsers.filter((user) => user.id !== userToDelete.id)
            );
            setIsConfirmingDelete(false);
            setUserToDelete(null);
        } catch (error) {
            console.log("Error deleting user: ", error);
        }
    }, [userToDelete]);

    const edit = useCallback((user: User) => {
        setEditingUser(user);
        setIsAddingUser(false);
    }, []);

    const handleSave = async (user: User) => {
        if (user.id != undefined) {
            await handleEdit(user);
        } else {
            await handleAdd(user);
        }
    };

    const handleEdit = async (updatedUser: User) => {
        try {
            const apiURL = import.meta.env.VITE_APP_API_URL;
            const response = await fetch(`${apiURL}/users/${updatedUser.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUser),
            });

            if (!response.ok) {
                throw new Error("Failed to update user");
            }

            const updatedUserData: User = await response.json();

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === updatedUser.id ? updatedUserData : user
                )
            );
            setEditingUser(null);
        } catch (error) {
            console.error("Error updating user: ", error);
        }
    };

    const handleAdd = async (newUser: User) => {
        try {
            const apiURL = import.meta.env.VITE_APP_API_URL;
            const response = await fetch(`${apiURL}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) {
                throw new Error("Failed to add user!");
            }

            const addedUser: User = await response.json();
            setUsers((prevUsers) => [...prevUsers, addedUser]);
            setIsAddingUser(false);
        } catch (error) {
            console.error("Error adding user: ", error);
        }
    };

    const handleCancel = () => {
        setEditingUser(null);
        setIsAddingUser(false);
        setIsConfirmingDelete(false);
    };

    const addUser = () => {
        setIsAddingUser(true);
        setEditingUser(null);
    };

    const deleteUser = (user: User) => {
        setIsAddingUser(false);
        setEditingUser(null);
        setIsConfirmingDelete(true);
        setUserToDelete(user);
    };


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error fetching users: {error}</div>;
    }


    return (
        <div className={styles.userList}>
            <div className={styles.userListHeader}>
                <h2>Users</h2>
                <button className="positive button" onClick={addUser}>
                    Add User
                </button>
            </div>
            <div className={styles.userListBody}>
                {users.map((user) => (
                    <UserEntry
                        key={user.id}
                        user={user}
                        onEdit={() => edit(user)}
                        onDelete={() => deleteUser(user)}
                    />
                ))}
            </div>
            {(editingUser || isAddingUser) && !isConfirmingDelete && (
                <UserForm
                    initialUser={editingUser || undefined}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isEditing={!!editingUser}
                />
            )}
            {isConfirmingDelete && (
                <ConfirmationModal
                    message={"Are you sure you want to delete this user?"}
                    onConfirm={handleDelete}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );

}

export default UserList;