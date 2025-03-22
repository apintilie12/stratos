import {Aircraft} from "../types/aircraft.types.ts";
import {useEffect, useState} from "react";
import {
    TextField,
    MenuItem,
    Button,
    Box,
    DialogTitle,
    Dialog,
    DialogContent,
    Alert,
} from "@mui/material";

interface AircraftFormProps {
    initialAircraft?: Aircraft;
    onSave: (aircraft: Aircraft) => void;
    onCancel: () => void;
    isEditing: boolean;
    apiError: string | null;
}

const AircraftForm: React.FC<AircraftFormProps> = ({initialAircraft, onSave, onCancel, isEditing, apiError}) => {
    const defaultAircraft: Aircraft = {registrationNumber: "", status: "", type: ""};
    const [formState, setFormState] = useState<Aircraft>(initialAircraft || defaultAircraft);
    const [types, setTypes] = useState<string[]>([]);
    const [statuses, setStatuses] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(apiError);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiURL = import.meta.env.VITE_APP_API_URL;
                const [typeResponse, statusesResponse] = await Promise.all([
                    fetch(`${apiURL}/aircraft/types`),
                    fetch(`${apiURL}/aircraft/statuses`)
                ]);

                if (!typeResponse.ok || !statusesResponse.ok) {
                    throw new Error("Failed to fetch data");
                }

                const typesValues = await typeResponse.json();
                const statusesValues = await statusesResponse.json();

                const formattedStatuses = statusesValues.map((status: string) =>
                    status.replace(/_/g, " ")
                );

                setTypes(typesValues);
                setStatuses(formattedStatuses);
            } catch (err) {
                setError(`Error : ${err}`);
            }
        };

        if(apiError === null) {
            fetchData();
        }
        setError(apiError);
    }, [apiError]);

    const handleChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const {name, value} = e.target;
        if (name) {
            setFormState((prevState) => ({
                ...prevState,
                [name]: value as string,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formState.registrationNumber || !formState.type || !formState.status) {
            setError("All fields are required.");
            return;
        }

        const updatedFormState = {
            ...formState,
            status: formState.status.replace(/ /g, "_") // Replaces all spaces with underscores
        };

        setError(null);
        onSave(updatedFormState);
    };

    return (
        <Dialog open={true} onClose={onCancel} fullWidth maxWidth="sm">
            <DialogTitle>{isEditing ? "Edit Aircraft" : "Add New Aircraft"}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Registration Number"
                        name="registrationNumber"
                        value={formState.registrationNumber}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                        placeholder={isEditing? "" : "Enter aircraft registration"}
                    />

                    <TextField
                        fullWidth
                        select
                        label="Type"
                        name="type"
                        value={formState.type}
                        onChange={handleChange}
                        margin="normal"
                        required
                    >
                        {types.map((t) => (
                            <MenuItem key={t} value={t}>{t}</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth
                        select
                        label="Status"
                        name="status"
                        value={formState.status}
                        onChange={handleChange}
                        margin="normal"
                        required
                    >
                        {statuses.map((s) => (
                            <MenuItem key={s} value={s}>{s}</MenuItem>
                        ))}
                    </TextField>
                    {error && <Alert severity="error">{error}</Alert>}
                    <Box sx={{display: "flex", justifyContent: "flex-end", gap: 2, mt: 2}}>
                        <Button variant="outlined" onClick={onCancel}>Cancel</Button>
                        <Button variant="contained" color="primary"
                                type="submit">{isEditing ? "Update" : "Add"}</Button>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>


    );
};

export default AircraftForm;