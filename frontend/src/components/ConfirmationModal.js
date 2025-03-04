
const ConfirmationModal = ({message, onConfirm, onCancel}) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{message}</h3>
                <div className="form-buttons">
                    <button class="positive button" onClick={onConfirm}>Yes</button>
                    <button class="negative button" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;