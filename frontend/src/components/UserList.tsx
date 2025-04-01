import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { User } from "../types/user.types.ts";
import UserEntry from "./UserEntry.tsx";
import UserForm from "./UserForm.tsx";
import ConfirmationModal from "./ConfirmationModal.tsx";
import {
    Paper, Typography, Button, CircularProgress, Alert, Box, List, ListItem
} from "@mui/material";
import {UserService} from "../services/UserService.ts";

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isAddingUser, setIsAddingUser] = useState<boolean>(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        UserService.getAllUsers()
            .then(setUsers)
            .catch((error) => {
                setError(error.message);
                setIsLoading(false);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const handleDelete = useCallback(async () => {
        if (userToDelete == null) return;
        try {
            await UserService.deleteUser(userToDelete.id);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete.id));
            setIsConfirmingDelete(false);
            setUserToDelete(null);
        } catch (error) {
            console.error("Error deleting user:", error);
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
            const updatedUserData = await UserService.updateUser(updatedUser);
            setUsers((prevUsers) => prevUsers.map((user) => (user.id === updatedUser.id ? updatedUserData : user)));
            setEditingUser(null);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handleAdd = async (newUser: User) => {
        try {
            const addedUser = await UserService.addUser(newUser);
            setUsers((prevUsers) => [...prevUsers, addedUser]);
            setIsAddingUser(false);
            setFormError(null);
        } catch (error) {
            if (error instanceof Error) {
                setFormError(error.message);
            } else {
                setFormError("An unknown error occurred.");
            }        }
    };

    const handleCancel = () => {
        setEditingUser(null);
        setIsAddingUser(false);
        setIsConfirmingDelete(false);
        setFormError(null);
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
        return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
    }

    if (error) {
        return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
    }

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mt: 4, width: "100%" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Users</Typography>
                <Button variant="contained" color="primary" onClick={addUser}>
                    Add User
                </Button>
            </Box>

            <List sx = {{maxHeight: "600px", overflowY: "auto"}}>
                {users.map((user) => (
                    <ListItem key={user.id} sx={{ borderBottom: "1px solid #ddd" }}>
                        <UserEntry
                            user={user}
                            onEdit={() => edit(user)}
                            onDelete={() => deleteUser(user)}
                        />
                    </ListItem>
                ))}
            </List>

            {(editingUser || isAddingUser) && !isConfirmingDelete && (
                <UserForm
                    initialUser={editingUser || undefined}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isEditing={!!editingUser}
                    apiError={formError}
                />
            )}
            {isConfirmingDelete && (
                <ConfirmationModal
                    message={"Are you sure you want to delete this user?"}
                    onConfirm={handleDelete}
                    onCancel={handleCancel}
                />
            )}
        </Paper>
    );
};

export default UserList;
