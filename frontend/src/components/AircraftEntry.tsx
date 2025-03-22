import {Aircraft} from "../types/aircraft.types.ts";
import {Box, Button, Card, CardContent, Typography} from "@mui/material"


interface AircraftEntryProps {
    aircraft: Aircraft;
    onEdit: (id?: string) => void;
    onDelete: (id?: string) => void;
}

const AircraftEntry: React.FC<AircraftEntryProps> = ({aircraft, onEdit, onDelete}) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "OPERATIONAL":
                return "success.main";
            case "IN_MAINTENANCE":
                return "warning.main";
            case "RETIRED":
                return "error.main";
            default:
                return "textSecondary";
        }
    };

    return (
        <Card sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderRadius: 2
        }}>
            <CardContent sx={{flex: 1}}>
                <Typography variant="h6">{aircraft.registrationNumber}</Typography>
                <Typography color="textSecondary">{aircraft.type}</Typography>
                <Typography sx={{color: getStatusColor(aircraft.status)}}>
                    {aircraft.status.replace(/_/g, " ")}
                </Typography>
            </CardContent>
            <Box sx={{display: "flex", gap: 1, pr: 2}}>
                <Button variant="contained" color="primary" onClick={() => onEdit(aircraft.id)}>
                    Edit
                </Button>
                <Button variant="contained" color="error" onClick={() => onDelete(aircraft.id)}>
                    Delete
                </Button>
            </Box>
        </Card>
    );
}

export default AircraftEntry;