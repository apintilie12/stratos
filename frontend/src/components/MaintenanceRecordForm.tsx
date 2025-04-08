import {Alert, Box, Button, Dialog, DialogContent, DialogTitle, MenuItem, TextField} from "@mui/material";
import { MaintenanceRecord } from "../types/maintenanceRecord.types.ts";
import { useEffect, useState } from "react";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {MaintenanceRecordService} from "../services/MaintenanceRecordService.ts";

interface MaintenanceRecordFormProps {
    initialRecord?: MaintenanceRecord;
    onSave: (record: MaintenanceRecord) => void;
    onCancel: () => void;
    isEditing: boolean;
    apiError: string | null;
    engineerId: string;
}

const MaintenanceRecordForm: React.FC<MaintenanceRecordFormProps> = ({
                                                                         initialRecord,
                                                                         onSave,
                                                                         onCancel,
                                                                         isEditing,
                                                                         apiError,
                                                                         engineerId,
                                                                     }) => {
    const defaultRecord: MaintenanceRecord = {
        id: undefined,
        aircraft: { registrationNumber: "", type: "", status: "" },
        engineer: engineerId,
        type: "",
        startDate: dayjs(),
        endDate: dayjs(),
        status: "",
    };

    const [formState, setFormState] = useState<MaintenanceRecord>(initialRecord || defaultRecord);
    const [error, setError] = useState<string | null>(apiError);
    const [types, setTypes] = useState<string[]>([]);
    const [statuses, setStatuses] = useState<string[]>([]);

    useEffect(() => {
        setError(apiError);
    }, [apiError]);

    useEffect(() => {
        MaintenanceRecordService.getAllMaintenanceStatuses().then(setStatuses).catch((error) => setError(error));
        MaintenanceRecordService.getAllMaintenanceTypes().then(setTypes).catch((error) => setError(error));
        console.log(formState);
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value,
            engineer: engineerId,
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!formState.aircraft || !formState.type || !formState.startDate || !formState.endDate || !formState.status) {
            setError("All fields are required");
            return;
        }

        setError(null);
        onSave(formState);
    };

    return (
        <Dialog open={true} onClose={onCancel} fullWidth maxWidth="sm">
            <DialogTitle>{isEditing ? "Edit Maintenance Record" : "Add New Maintenance Record"}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Maintenance Type"
                        name="type"
                        select
                        value={formState.type}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                        placeholder="Enter maintenance type"
                    >
                        {types.map((type) => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                    </TextField>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box sx={{
                            width: '100%',
                            justifyContent: 'space-between',
                            display: 'flex',
                            paddingTop: '1rem',
                            paddingBottom: '0.5rem',
                        }}>
                            <DateTimePicker
                                label="Start Date"
                                name="startDate"
                                value={isEditing ? formState.startDate : null}
                                onChange={(newValue) => setFormState((prev) => ({
                                    ...prev,
                                    startDate: newValue || dayjs(),
                                }))}
                            />

                            <DateTimePicker
                                label="End Date"
                                name="endDate"
                                value={isEditing ? formState.endDate : null}
                                onChange={(newValue) => setFormState((prev) => ({
                                    ...prev,
                                    endDate: newValue || dayjs(),
                                }))}
                            />
                        </Box>
                    </LocalizationProvider>

                    <TextField
                        fullWidth
                        label="Aircraft Registration"
                        name="aircraft"
                        value={isEditing ? formState.aircraft.registrationNumber : undefined}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        required
                    />

                    <TextField
                        fullWidth
                        select
                        label="Status"
                        name="status"
                        value={formState.status}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        required
                    >
                        {statuses.map((stat) => (
                            <MenuItem key={stat} value={stat}>{stat.replace(/_/g, " ")}</MenuItem>
                        ))}
                    </TextField>

                    {error && <Alert severity="error">{error}</Alert>}

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                        <Button variant="outlined" onClick={onCancel}>Cancel</Button>
                        <Button variant="contained" color="primary" type="submit">
                            {isEditing ? "Update" : "Add"}
                        </Button>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default MaintenanceRecordForm;
