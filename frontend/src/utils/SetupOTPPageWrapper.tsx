import { useLocation, Navigate } from "react-router-dom";
import SetupOTPPage from "../pages/SetupOTPPage";

const SetupOTPPageWrapper = () => {
    const location = useLocation();
    const state = location.state as { username?: string };

    if (!state?.username) {
        // Redirect if username isn't present (e.g., user accessed manually)
        return <Navigate to="/login" replace />;
    }

    return <SetupOTPPage username={state.username} />;
};

export default SetupOTPPageWrapper;
