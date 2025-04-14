import { Outlet, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import TokenPayload from "../types/TokenPayload.types.ts";

const AuthenticatedRouteGuard = ({ requiredRole }: { requiredRole: string }) => {
    const token = sessionStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const decodedToken = jwtDecode<TokenPayload>(token);

        const isIssuerValid = decodedToken.iss === "Stratos";
        const isNotExpired = decodedToken.exp * 1000 > Date.now();
        const hasRequiredClaims = decodedToken.userId && decodedToken.role;

        if (!isIssuerValid || !isNotExpired || !hasRequiredClaims) {
            return <Navigate to="/login" />;
        }

        if (decodedToken.role !== requiredRole) {
            return <Navigate to="/login" />;
        }
    } catch (error) {
        console.error("Invalid token:", error);
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default AuthenticatedRouteGuard;
