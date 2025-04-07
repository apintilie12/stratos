import { MaintenanceRecord } from "../types/maintenanceRecord.types.ts";
import { useCallback, useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, List, ListItem, Paper, Typography } from "@mui/material";
import * as React from "react";
import MaintenanceRecordEntry from "./MaintenanceRecordEntry.tsx";
// import MaintenanceRecordForm from "./MaintenanceRecordForm.tsx";
import ConfirmationModal from "./ConfirmationModal.tsx";
import { MaintenanceRecordService } from "../services/MaintenanceRecordService.ts";
import {useParams} from "react-router-dom";

const MaintenanceRecordList: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingRecord, setEditingRecord] = useState<MaintenanceRecord | null>(null);
    const [isAddingRecord, setIsAddingRecord] = useState<boolean>(false);
    const [recordToDelete, setRecordToDelete] = useState<MaintenanceRecord | null>(null);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMaintenanceRecords = async () => {
            try {
                console.log(userId);
                const records = await MaintenanceRecordService.getMaintenanceRecordsForUser(userId || "");
                setMaintenanceRecords(records);
            } catch (error) {
                setError(error instanceof Error ? error.message : "Unknown error");
            } finally {
                setIsLoading(false);
            }
        };
        fetchMaintenanceRecords();
    }, []);

    const handleDelete = useCallback(async () => {
        try {
            if (!recordToDelete) return;
            await MaintenanceRecordService.deleteMaintenanceRecord(recordToDelete.id);
            setMaintenanceRecords(prevRecords => prevRecords.filter(record => record.id !== recordToDelete.id));
            setIsConfirmingDelete(false);
            setRecordToDelete(null);
        } catch (err) {
            console.log(err);
        }
    }, [recordToDelete]);

    const editRecord = useCallback((record: MaintenanceRecord) => {
        setEditingRecord(record);
        setIsAddingRecord(false);
    }, []);

    const handleSave = async (record: MaintenanceRecord) => {
        if (record.id !== undefined) {
            await handleEdit(record);
        } else {
            await handleAdd(record);
        }
    };

    const handleEdit = async (updatedRecord: MaintenanceRecord) => {
        try {
            const updatedRecordData = await MaintenanceRecordService.updateMaintenanceRecord(updatedRecord);
            setMaintenanceRecords(prevRecords => prevRecords.map(record => record.id === updatedRecord.id ? updatedRecordData : record));
            setEditingRecord(null);
        } catch (err) {
            console.log(err);
        }
    };

    const handleAdd = async (newRecord: MaintenanceRecord) => {
        try {
            const addedRecord = await MaintenanceRecordService.addMaintenanceRecord(newRecord);
            setMaintenanceRecords(prevRecords => [...prevRecords, addedRecord]);
            setIsAddingRecord(false);
            setFormError(null);
        } catch (error) {
            if(error instanceof Error) {
                setFormError(error.message);
            } else {
                setFormError("Unknown error occurred");
            }
            console.error("Error adding maintenance record: ", error);
        }
    };

    const handleCancel = () => {
        setEditingRecord(null);
        setIsAddingRecord(false);
        setIsConfirmingDelete(false);
        setFormError(null);
    };

    const addRecord = () => {
        setIsAddingRecord(true);
        setEditingRecord(null);
    };

    const deleteRecord = (record: MaintenanceRecord) => {
        setIsAddingRecord(false);
        setEditingRecord(null);
        setIsConfirmingDelete(true);
        setRecordToDelete(record);
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
                <Typography variant="h5">Maintenance Records</Typography>
                <Button variant="contained" color="primary" onClick={addRecord}>
                    Add Maintenance Record
                </Button>
            </Box>

            <List sx={{ maxHeight: "600px", overflowY: "auto" }}>
                {maintenanceRecords.map((record) => (
                    <ListItem key={record.id} sx={{ borderBottom: "1px solid #ddd" }}>
                        <MaintenanceRecordEntry
                            record={record}
                            onEdit={() => editRecord(record)}
                            onDelete={() => deleteRecord(record)} />
                    </ListItem>
                ))}
            </List>

            {(editingRecord || isAddingRecord) && !isConfirmingDelete && (
                // <MaintenanceRecordForm
                //     initialRecord={editingRecord || undefined}
                //     onSave={handleSave}
                //     onCancel={handleCancel}
                //     isEditing={!!editingRecord}
                //     apiError={formError}
                // />
                <div>Editing or adding + {formError}</div>
            )}

            {isConfirmingDelete && (
                <ConfirmationModal
                    message={"Are you sure you want to delete this maintenance record?"}
                    onConfirm={handleDelete}
                    onCancel={handleCancel}
                />
            )}
        </Paper>
    );
};

export default MaintenanceRecordList;
