import {MaintenanceRecord} from "../types/maintenanceRecord.types.ts";
import {Box, Button, Card, CardContent, Typography} from "@mui/material";

interface MaintenanceRecordEntryProps {
    record: MaintenanceRecord;
    onEdit: (id?: string) => void;
    onDelete: (id?: string) => void;
}

const MaintenanceRecordEntry: React.FC<MaintenanceRecordEntryProps> = ({record, onEdit, onDelete}) => {

    const getStatusColor = (status: string): string => {
        switch (status) {
            case "PENDING":
                return "info.main";       // Blue-ish
            case "SCHEDULED":
                return "warning.main";    // Yellow/Amber
            case "IN_PROGRESS":
                return "error.main";      // Red or switch to orange if using custom theme
            case "COMPLETED":
                return "success.main";    // Green
            default:
                return "text.primary";
        }
    };


    return (
        <Card
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                borderRadius: 2,
                boxShadow: 2,
            }}
        >
            <CardContent sx={{flex: 1, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap"}}>
                <Typography variant="h6" sx={{width:"150px"}}>
                    Aircraft: {record.aircraft.registrationNumber}
                </Typography>
                <Typography variant="h6" sx={{width: 120}}>
                    {record.type}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Start: {record.startDate.toLocaleString()}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    End: {record.endDate.toLocaleString()}
                </Typography>
                <Typography variant="h6" color={getStatusColor(record.status)}>
                    {record.status.replace(/_/g, " ")}
                </Typography>
            </CardContent>
            <Box sx={{display: "flex", gap: 1, pr: 2}}>
                <Button variant="contained" color="primary" onClick={() => onEdit(record.id)}>
                    Edit
                </Button>
                <Button variant="contained" color="error" onClick={() => onDelete(record.id)}>
                    Delete
                </Button>
            </Box>
        </Card>
    );
};

export default MaintenanceRecordEntry;
