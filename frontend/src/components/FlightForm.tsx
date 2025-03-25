import {Alert, Box, Button, Dialog, DialogContent, DialogTitle, TextField} from "@mui/material";
import {Flight} from "../types/flight.types.ts";
import {useEffect, useState} from "react";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";


interface FlightFormProps {
    initialFlight?: Flight;
    onSave: (flight: Flight) => void;
    onCancel: () => void;
    isEditing: boolean;
    apiError: string | null;
}

const FlightForm: React.FC<FlightFormProps> = ({initialFlight, onSave, onCancel, isEditing, apiError}) => {
    const defaultFlight: Flight = {
        flightNumber: "",
        departureAirport: "",
        arrivalAirport: "",
        departureTime: dayjs(),
        arrivalTime: dayjs(),
        aircraft: {registrationNumber: "", type: "", status: ""}
    }
    const [formState, setFormState] = useState<Flight>(initialFlight || defaultFlight);
    const [error, setError] = useState<string | null>(apiError);

    useEffect(() => {
        setError(apiError);
    }, [apiError]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value,
        }));

    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!formState.aircraft || !formState.departureAirport || !formState.departureTime || !formState.arrivalTime || !formState.arrivalAirport || !formState.flightNumber) {
            setError("All fields are required");
            return
        }

        setError(null);
        onSave(formState);
    }

    return (
        <Dialog open={true} onClose={onCancel} fullWidth maxWidth="sm">
            <DialogTitle>{isEditing ? "Edit Flight" : "Add New Flight"}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Flight Number"
                        name="flightNumber"
                        value={formState.flightNumber}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                        placeholder="Enter flight number"
                    />

                    <TextField
                        label="Departure Airport"
                        name="departureAirport"
                        value={formState.departureAirport}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                        placeholder="Enter departure airport"
                    />

                    <TextField
                        label="Arrival Airport"
                        name="arrivalAirport"
                        value={formState.arrivalAirport}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                        placeholder="Enter arrival airport"
                    />


                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box sx={{
                            width: '100%',
                            justifyContent: 'space-between',
                            display: 'flex',
                            paddingTop: '1rem',
                            paddingBottom: '0.5rem'
                        }}>
                            <DateTimePicker
                                label="Departure Time"
                                name="departureTime"
                                value={isEditing ? formState.departureTime : null}
                                onChange={(newValue) => setFormState((prev) => ({
                                    ...prev,
                                    departureTime: newValue || dayjs()
                                }))}
                            />

                            <DateTimePicker
                                label="Arrival Time"
                                name="arrivalTime"
                                value={isEditing ? formState.arrivalTime : null}
                                onChange={(newValue) => setFormState((prev) => ({
                                    ...prev,
                                    arrivalTime: newValue || dayjs()
                                }))}
                            />
                        </Box>
                    </LocalizationProvider>

                    <TextField
                        fullWidth
                        label="Aircraft"
                        name="aircraft"
                        value={formState.aircraft.registrationNumber}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        required
                    />

                    {error && <Alert severity="error">{error}</Alert>}

                    <Box sx={{display: "flex", justifyContent: "flex-end", gap: 2, mt: 2}}>
                        <Button variant="outlined" onClick={onCancel}>Cancel</Button>
                        <Button variant="contained" color="primary" type="submit">
                            {isEditing ? "Update" : "Add"}
                        </Button>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default FlightForm;