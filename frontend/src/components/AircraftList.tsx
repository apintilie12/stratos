import * as React from "react";
import {useState, useEffect, useCallback} from "react";
import {Aircraft} from "../types/aircraft.types.ts";
import {Alert, Box, Button, CircularProgress, List, ListItem, Paper, Typography} from "@mui/material";
import AircraftEntry from "./AircraftEntry.tsx";
import AircraftForm from "./AircraftForm.tsx";
import ConfirmationModal from "./ConfirmationModal.tsx";

const AircraftList: React.FC = () => {
    const [aircraft, setAircraft] = useState<Aircraft[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingAircraft, setEditingAircraft] = useState<Aircraft | null>(null);
    const [isAddingAircraft, setIsAddingAircraft] = useState<boolean>(false);
    const [aircraftToDelete, setAircraftToDelete] = useState<Aircraft | null>(null);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
    const [formError, setFormError] = useState<string | null>(null);

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

    const handleDelete = useCallback(async () => {
        try {
            if(!aircraftToDelete) return;
            const apiURL = import.meta.env.VITE_APP_API_URL;
            const response = await fetch(`${apiURL}/aircraft/${aircraftToDelete.id}`, {
                method: "DELETE",
            });

            if(!response.ok) {
                throw new Error("Failed to delete aircraft");
            }

            setAircraft((prevAircraft) =>
                prevAircraft.filter((aircraft) => aircraft.id !== aircraftToDelete.id)
            );
            setIsConfirmingDelete(false);
            setAircraftToDelete(null);
        } catch (err) {
            console.log(err);
        }
    }, [aircraftToDelete]);

    const editAircraft = useCallback((aircraft: Aircraft) => {
       setEditingAircraft(aircraft);
       setIsAddingAircraft(false);
    }, []);

    const handleSave = async (aircraft: Aircraft) => {
        if(aircraft.id != undefined) {
            await handleEdit(aircraft);
        } else {
            await handleAdd(aircraft);
        }
    };

    const handleEdit = async (updatedAircraft: Aircraft) => {
      try {
          const apiURL = import.meta.env.VITE_APP_API_URL;
          const response = await fetch(`${apiURL}/aircraft/${updatedAircraft.id}`, {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedAircraft),
          });

          if(!response.ok) {
              throw new Error("Failed to udpate aircraft");
          }

          const updatedAircraftData: Aircraft = await response.json();
          setAircraft((prevAircraft) =>
            prevAircraft.map((aircraft) =>
                aircraft.id === updatedAircraft.id ? updatedAircraftData : aircraft
            )
          );
          setEditingAircraft(null);
      } catch (err) {
          console.log(err);
      }
    };

    const handleAdd = async (newAircraft: Aircraft) => {
        try {
            const apiURL = import.meta.env.VITE_APP_API_URL;
            const response = await fetch(`${apiURL}/aircraft`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newAircraft),
            });

            const responseData = await response.json();
            console.log("Tried to add aircraft " + newAircraft);

            if (!response.ok) {
                const errorMessage = responseData.message || "Failed to add aircraft";
                console.log(errorMessage);
                setFormError(errorMessage);
                return;
            }

            const addedAircraft: Aircraft = responseData;
            setAircraft((prevAircraft) => [...prevAircraft, addedAircraft]);
            setIsAddingAircraft(false);
            setFormError(null);
        } catch (error) {
            console.error("Error adding aircraft: ", error);
        }
    };

    const handleCancel = () => {
        setEditingAircraft(null);
        setIsAddingAircraft(false);
        setIsConfirmingDelete(false);
        setFormError(null);
    };

    const addAircraft = () => {
        setIsAddingAircraft(true);
        setEditingAircraft(null);
    };


    const deleteAircraft = (aircraft: Aircraft) => {
        setIsAddingAircraft(false);
        setEditingAircraft(null);
        setIsConfirmingDelete(true);
        setAircraftToDelete(aircraft);
    };


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
                <Button variant="contained" color="primary" onClick={addAircraft}>
                    Add Aircraft
                </Button>
            </Box>

            <List sx={{maxHeight: "600px", overflowY: "auto"}}>
                {aircraft.map((aircraft) => (
                    <ListItem key={aircraft.id} sx={{borderBottom: "1px solid #ddd"}}>
                        <AircraftEntry
                            aircraft={aircraft}
                            onEdit={() => editAircraft(aircraft)}
                            onDelete={() => deleteAircraft(aircraft)}
                        />
                    </ListItem>
                ))}
            </List>

            {(editingAircraft || isAddingAircraft) && !isConfirmingDelete && (
                <AircraftForm
                    initialAircraft={editingAircraft || undefined}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isEditing={!!editingAircraft}
                    apiError={formError}
                />
            )}
            {isConfirmingDelete && (
                <ConfirmationModal
                    message={"Are you sure you want to delete this aircraft?"}
                    onConfirm={handleDelete}
                    onCancel={handleCancel}
                />
            )}
        </Paper>
    );
}

export default AircraftList;