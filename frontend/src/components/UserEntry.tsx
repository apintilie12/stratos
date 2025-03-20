import { User } from "../types/user.types.ts";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";

interface UserEntryProps {
    user: User;
    onEdit: (id?: string) => void;
    onDelete: (id?: string) => void;
}

const UserEntry: React.FC<UserEntryProps> = ({ user, onEdit, onDelete }) => {
    return (
        <Card sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderRadius: 2 }}>
            <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6">{user.username}</Typography>
                <Typography color="textSecondary">{user.role}</Typography>
            </CardContent>
            <Box sx={{ display: "flex", gap: 1, pr: 2 }}>
                <Button variant="contained" color="primary" onClick={() => onEdit(user.id)}>
                    Edit
                </Button>
                <Button variant="contained" color="error" onClick={() => onDelete(user.id)}>
                    Delete
                </Button>
            </Box>
        </Card>
    );
};

export default UserEntry;
