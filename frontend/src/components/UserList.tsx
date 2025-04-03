import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { User } from "../types/user.types.ts";
import UserEntry from "./UserEntry.tsx";
import UserForm from "./UserForm.tsx";
import ConfirmationModal from "./ConfirmationModal.tsx";
import {
    Paper, Typography, Button, CircularProgress, Alert, Box, List, ListItem, TextField, MenuItem
} from "@mui/material";
import { UserService } from "../services/UserService.ts";

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isAddingUser, setIsAddingUser] = useState<boolean>(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [userRoles, setUserRoles] = useState<string[]>([]);

    const [usernameFilter, setUsernameFilter] = useState<string>("");
    const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
    const [sortBy, setSortBy] = useState<string>("username");
    const [sortOrder, setSortOrder] = useState<string>("asc");

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const users = await UserService.getAllUsers({ username: usernameFilter, role: roleFilter, sortBy, sortOrder });
            setUsers(users);
            setError(null);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to fetch users");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        UserService.getUserRoles().then(setUserRoles).catch((error) => console.log(error));
        fetchUsers();
    }, []);

    const handleDelete = useCallback(async () => {
        if (!userToDelete) return;
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
                console.log("Unknown error: ", error);
            }
        }
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
            {/* Filter & Sorting Controls */}
            <Box display="flex" gap={2} mb={2}>
                <TextField
                    label="Username"
                    variant="outlined"
                    size="small"
                    value={usernameFilter}
                    onChange={(e) => setUsernameFilter(e.target.value)}
                />
                <TextField
                    label="Role"
                    select
                    variant="outlined"
                    size="small"
                    value={roleFilter || ""}
                    onChange={(e) => setRoleFilter(e.target.value || undefined)}
                    sx={{width:"150px"}}
                >
                    <MenuItem value="">All</MenuItem>
                    {userRoles.map((role) => (
                        <MenuItem key={role} value={role}>
                            {role}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Sort By"
                    select
                    variant="outlined"
                    size="small"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <MenuItem value="username">Username</MenuItem>
                    <MenuItem value="role">Role</MenuItem>
                </TextField>
                <TextField
                    label="Sort Order"
                    select
                    variant="outlined"
                    size="small"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <MenuItem value="asc">Ascending</MenuItem>
                    <MenuItem value="desc">Descending</MenuItem>
                </TextField>
                <Button variant="contained" onClick={fetchUsers}>Apply Filters</Button>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Users</Typography>
                <Button variant="contained" color="primary" onClick={addUser}>
                    Add User
                </Button>
            </Box>

            <List sx={{ maxHeight: "600px", overflowY: "auto" }}>
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
