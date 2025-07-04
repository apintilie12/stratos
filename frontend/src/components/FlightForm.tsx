import {Alert, Autocomplete, Box, Button, Dialog, DialogContent, DialogTitle, TextField} from "@mui/material";
import {Flight} from "../types/flight.types.ts";
import {useEffect, useState} from "react";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {FlightService} from "../services/FlightService.ts";


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
        arrivalTime: null,
        aircraft: ""
    }
    const [formState, setFormState] = useState<Flight>(initialFlight || defaultFlight);
    const [error, setError] = useState<string | null>(apiError);
    const [airports, setAirports] = useState<string[]>([]);

    useEffect(() => {
        setError(apiError);
    }, [apiError]);

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const apiURL = import.meta.env.VITE_APP_API_URL;
                const response = await fetch(`${apiURL}/airports`);
                if(!response.ok) {
                    throw new Error("Error fetching Airports");
                }
                setAirports(await response.json());
            } catch (err) {
                console.log(err);
            }
        }
        fetchAirports();
    }, [])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value,
        }));
        console.log(formState);
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

    const getArrivalTime = async () => {
        try {
            const arrival = await FlightService.getArrivalTime(formState);
            setFormState(prev => ({
                ...prev,
                arrivalTime: dayjs(arrival),
            }));
        } catch (err: unknown) {
            console.error(err);
            if (err instanceof Error) {
                setError(err.message || "Failed to get arrival time");
            }
        }
    };


    return (
        <Dialog open={true} onClose={onCancel} fullWidth maxWidth="sm">
            <DialogTitle>{isEditing ? "Edit Flight" : "Add New Flight"}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>

                    <TextField
                        fullWidth
                        label="Aircraft"
                        name="aircraft"
                        value={formState.aircraft}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        required
                    />

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

                    <Autocomplete
                        options={airports}
                        getOptionLabel={(option: string) => option}
                        value={formState.departureAirport}
                        onChange={(_event, newValue) => setFormState((prev) => ({
                            ...prev,
                            departureAirport: newValue ? newValue : ""
                        }))}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Departure Airport"
                                variant="outlined"
                                fullWidth
                                required
                                margin="normal"
                            />
                        )}
                        noOptionsText="No airports found"
                    />

                    {/* Arrival Airport Autocomplete */}
                    <Autocomplete
                        options={airports}
                        getOptionLabel={(option: string) => option}
                        value={formState.arrivalAirport}
                        onChange={(_event, newValue) => setFormState((prev) => ({
                            ...prev,
                            arrivalAirport: newValue ? newValue : ""
                        }))}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Arrival Airport"
                                variant="outlined"
                                fullWidth
                                required
                                margin="normal"
                            />
                        )}
                        noOptionsText="No airports found"
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
                                onChange={async (newValue) => {
                                    if (!newValue) return;
                                    const updatedFlight = {
                                        ...formState,
                                        departureTime: newValue,
                                    };
                                    setFormState(updatedFlight);

                                    // Step 2: Call the API to get the arrival time
                                    await getArrivalTime();
                                }}
                            />

                            <DateTimePicker
                                label="Arrival Time"
                                name="arrivalTime"
                                value={formState.arrivalTime}
                                readOnly={true}
                                onChange={(newValue) => setFormState((prev) => ({
                                    ...prev,
                                    arrivalTime: newValue || dayjs()
                                }))}
                            />
                        </Box>
                    </LocalizationProvider>


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