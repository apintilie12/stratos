import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

interface ConfirmationModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ message, onConfirm, onCancel }) => {
    return (
        <Dialog
            open={true}
            onClose={onCancel}
        >
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogContent>
                <h3>{message}</h3>
            </DialogContent>
            <DialogActions>
                <Button onClick={onConfirm} color="primary" variant="contained">
                    Yes
                </Button>
                <Button onClick={onCancel} color="secondary" variant="outlined">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationModal;
