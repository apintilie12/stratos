import { Flight } from "../types/flight.types.ts";
import { useCallback, useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, List, ListItem, Paper, Typography } from "@mui/material";
import * as React from "react";
import FlightEntry from "./FlightEntry.tsx";
import FlightForm from "./FlightForm.tsx";
import dayjs from "dayjs";
import ConfirmationModal from "./ConfirmationModal.tsx";
import { FlightService } from "../services/FlightService";

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
                const body = await FlightService.getAllFlights();
                const parsedFlights = body.map(flight => ({
                    ...flight,
                    departureTime: dayjs.tz(flight.departureTime),
                    arrivalTime: dayjs.tz(flight.arrivalTime)
                }));
                setFlights(parsedFlights);
            } catch (error) {
                setError(error instanceof Error ? error.message : "Unknown error");
            } finally {
                setIsLoading(false);
            }
        };
        fetchFlights();
    }, []);

    const handleDelete = useCallback(async () => {
        try {
            if (!flightToDelete) return;
            await FlightService.deleteFlight(flightToDelete.id);
            setFlights(prevFlights => prevFlights.filter(flight => flight.id !== flightToDelete.id));
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
        if (flight.id !== undefined) {
            await handleEdit(flight);
        } else {
            await handleAdd(flight);
        }
    };

    const handleEdit = async (updatedFlight: Flight) => {
        try {
            const updatedFlightData = await FlightService.updateFlight(updatedFlight);
            setFlights(prevFlights => prevFlights.map(flight => flight.id === updatedFlight.id ? updatedFlightData : flight));
            setEditingFlight(null);
        } catch (err) {
            console.log(err);
        }
    };

    const handleAdd = async (newFlight: Flight) => {
        try {
            const addedFlight = await FlightService.addFlight(newFlight);
            setFlights(prevFlights => [...prevFlights, addedFlight]);
            setIsAddingFlight(false);
            setFormError(null);
        } catch (error) {
            if(error instanceof Error) {
                setFormError(error.message);
                console.log("Is instance of Error");
            } else {
                setFormError("Unknown error occurred");
            }
            console.error("Error adding flight: ", error);
        }
    };

    const handleCancel = () => {
        setEditingFlight(null);
        setIsAddingFlight(false);
        setIsConfirmingDelete(false);
        setFormError(null);
    };

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
        return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
    }

    if (error) {
        return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
    }

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mt: 4, width: "100%" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Flights</Typography>
                <Button variant="contained" color="primary" onClick={addFlight}>
                    Add Flight
                </Button>
            </Box>

            <List sx={{ maxHeight: "600px", overflowY: "auto" }}>
                {flights.map((flight) => (
                    <ListItem key={flight.id} sx={{ borderBottom: "1px solid #ddd" }}>
                        <FlightEntry
                            flight={flight}
                            onEdit={() => editFlight(flight)}
                            onDelete={() => deleteFlight(flight)} />
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