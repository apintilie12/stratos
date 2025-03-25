import {Flight} from "../types/flight.types.ts";
import {useCallback, useEffect, useState} from "react";
import {Alert, Box, Button, CircularProgress, List, ListItem, Paper, Typography} from "@mui/material";
import * as React from "react";
import FlightEntry from "./FlightEntry.tsx";
import FlightForm from "./FlightForm.tsx";
import dayjs from "dayjs";
import ConfirmationModal from "./ConfirmationModal.tsx";

const FlightList: React.FC = () => {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
    const [isAddingFlight, setIsAddingFlight] = useState<boolean>(false);
    const [flightToDelete, setFlightToDelete] = useState<Flight | null>(null);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
    const [formError, setFormError] = useState<string | null>(null);
    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const apiURL = import.meta.env.VITE_APP_API_URL;
                const response = await fetch(`${apiURL}/flights`);
                const body: Flight[] = await response.json();

                const parsedFlights = body.map(flight => ({
                    ...flight,
                    departureTime: dayjs.tz(flight.departureTime),
                    arrivalTime: dayjs.tz(flight.arrivalTime)
                }));

                setFlights(parsedFlights);
                setIsLoading(false);
            } catch (error) {
                let message = "Unknown error";
                if (error instanceof Error) message = error.message;
                setError(message);
                setIsLoading(false);
            }
        };

        fetchFlights();
    }, [])

    const handleDelete = useCallback(async () => {
        try {
            if (!flightToDelete) return;
            const apiURL = import.meta.env.VITE_APP_API_URL;
            const response = await fetch(`${apiURL}/flights/${flightToDelete.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete flight");
            }

            setFlights((prevFligths) => prevFligths.filter((flight) => flight.id !== flightToDelete.id));
            setIsConfirmingDelete(false);
            setFlightToDelete(null);
        } catch (err) {
            console.log(err);
        }
    }, [flightToDelete]);

    const editFlight = useCallback((flight: Flight) => {
        setEditingFlight(flight);
        setIsAddingFlight(false);
    }, []);

    const handleSave = async (flight: Flight) => {
        if (flight.id != undefined) {
            await handleEdit(flight);
        } else {
            await handleAdd(flight);
        }
    };

    const handleEdit = async (updatedFlight: Flight) => {
        try {
            const apiURL = import.meta.env.VITE_APP_API_URL;
            const response = await fetch(`${apiURL}/flights/${updatedFlight.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFlight),
            });

            if (!response.ok) {
                throw new Error("Failed to udpate aircraft");
            }

            const updatedAircraftData: Flight = await response.json();
            setFlights((prevFlights) =>
                prevFlights.map((flight) =>
                    flight.id === updatedFlight.id ? updatedAircraftData : flight
                )
            );
            setEditingFlight(null);
        } catch (err) {
            console.log(err);
        }
    };

    const handleAdd = async (newFlight: Flight) => {
        try {
            console.log(JSON.stringify(newFlight));
            const apiURL = import.meta.env.VITE_APP_API_URL;
            const response = await fetch(`${apiURL}/flights`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newFlight),
            });

            const responseData = await response.json();
            console.log("Tried to add aircraft " + newFlight);

            if (!response.ok) {
                const errorMessage = responseData.message || "Failed to add aircraft";
                console.log(errorMessage);
                setFormError(errorMessage);
                return;
            }

            const addedFlight: Flight = responseData;
            setFlights((prevFlights) => [...prevFlights, addedFlight]);
            setIsAddingFlight(false);
            setFormError(null);
        } catch (error) {
            console.error("Error adding aircraft: ", error);
        }
    };

    const handleCancel = () => {
        setEditingFlight(null);
        setIsAddingFlight(false);
        setIsConfirmingDelete(false);
        setFormError(null)
    }

    const addFlight = () => {
        setIsAddingFlight(true);
        setEditingFlight(null);
    };

    const deleteFlight = (flight: Flight) => {
        setIsAddingFlight(false);
        setEditingFlight(null);
        setIsConfirmingDelete(true);
        setFlightToDelete(flight);
    };

    if (isLoading) {
        return <CircularProgress sx={{display: "block", mx: "auto", mt: 4}}/>;
    }

    if (error) {
        return <Alert severity="error" sx={{mt: 2}}>{error}</Alert>;
    }

    return (
        <Paper elevation={3} sx={{p: 3, borderRadius: 3, mt: 4, width: "100%"}}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Flights</Typography>
                <Button variant="contained" color="primary" onClick={addFlight}>
                    Add Flight
                </Button>
            </Box>

            <List sx={{maxHeight: "600px", overflowY: "auto"}}>
                {flights.map((flight) => (
                    <ListItem key={flight.id} sx={{borderBottom: "1px solid #ddd"}}>
                        <FlightEntry
                            flight={flight}
                            onEdit={() => editFlight(flight)}
                            onDelete={() => deleteFlight(flight)}/>
                    </ListItem>
                ))}
            </List>

            {(editingFlight || isAddingFlight) && !isConfirmingDelete && (
                <FlightForm
                    initialFlight={editingFlight || undefined}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isEditing={!!editingFlight}
                    apiError={formError}
                />
            )}

            {isConfirmingDelete && (
                <ConfirmationModal
                    message={"Are you sure you want to delete this flight?"}
                    onConfirm={handleDelete}
                    onCancel={handleCancel}
                />
            )}
        </Paper>
    );
}

export default FlightList;