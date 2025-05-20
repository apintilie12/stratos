import {Flight} from "../types/flight.types.ts";
import {Box, Button, Card, CardContent, Typography} from "@mui/material";
import {ArrowForward} from "@mui/icons-material";

interface FlightEntryProps {
    flight: Flight;
    onEdit: (id?: string) => void;
    onDelete: (id?: string) => void;
}

const FlightEntry: React.FC<FlightEntryProps> = ({ flight, onEdit, onDelete }) => {
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
            <CardContent sx={{ flex: 1, display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="h6" sx={{width:75}}>{flight.flightNumber}</Typography>
                <Typography variant="h6" sx={{width:36}}>
                    {flight.departureAirport}</Typography>
                <ArrowForward sx={{verticalAlign:"middle"}}/>
                <Typography variant="h6" sx={{width:40}}>
                    {flight.arrivalAirport}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Departure: {flight.departureTime.toLocaleString()}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Arrival: {flight.arrivalTime.toLocaleString()}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Aircraft: {flight.aircraft}
                </Typography>
            </CardContent>
            <Box sx={{ display: "flex", gap: 1, pr: 2 }}>
                <Button variant="contained" color="primary" onClick={() => onEdit(flight.id)}>
                    Edit
                </Button>
                <Button variant="contained" color="error" onClick={() => onDelete(flight.id)}>
                    Delete
                </Button>
            </Box>
        </Card>
    );
}

export default FlightEntry;