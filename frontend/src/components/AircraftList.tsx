import * as React from "react";
import {useState, useEffect} from "react";
import {Aircraft} from "../types/aircraft.types.ts";
import {Alert, Box, Button, CircularProgress, List, ListItem, Paper, Typography} from "@mui/material";
import AircraftEntry from "./AircraftEntry.tsx";

const AircraftList: React.FC = () => {
    const [aircraft, setAircraft] = useState<Aircraft[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAircraft = async () => {
            try {
                const apiURL = import.meta.env.VITE_APP_API_URL;
                const response = await fetch(`${apiURL}/aircraft`);
                const body: Aircraft[] = await response.json();
                setAircraft(body);
                setIsLoading(false);
            } catch (error) {
                let message = 'Unknown error';
                if (error instanceof Error) message = error.message;
                setError(message);
                setIsLoading(false)
            }
        }

        fetchAircraft();
    }, []);

    const editAircraft = (id?: string) => {
        console.log(`Editing user with id ${id}`);
    }

    const deleteAircraft = (id?: string) => {
        console.log(`Deleting user with id ${id}`);
    }

    if (isLoading) {
        return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
    }

    if (error) {
        return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
    }

    return (
        <Paper elevation={3} sx={{p: 3, borderRadius: 3, mt: 4, width: "100%"}}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Aircraft</Typography>
                <Button variant="contained" color="primary" onClick={() => setError("Add Aircraft")}>
                    Add Aircraft
                </Button>
            </Box>

            <List sx={{maxHeight: "600px", overflowY: "auto"}}>
                {aircraft.map((aircraft) => (
                    <ListItem key={aircraft.id} sx={{borderBottom: "1px solid #ddd"}}>
                        <AircraftEntry
                            aircraft={aircraft}
                            onEdit={() => editAircraft(aircraft.id)}
                            onDelete={() => deleteAircraft(aircraft.id)}
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}

export default AircraftList;