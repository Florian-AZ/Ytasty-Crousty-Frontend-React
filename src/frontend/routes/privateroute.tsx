import type { ReactNode } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

import type { RootState } from "../store/store.ts";
import type { Role } from "../types/user.ts";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles: readonly Role[];
}

export default function ProtectedRoute({
    children,
    allowedRoles,
}: ProtectedRouteProps) {
    const user = useSelector((state: RootState) => state.userLogged.userLogged);
    const loading = useSelector((state: RootState) => state.loading.value);
    const location = useLocation();

    if (loading) {
        return (
            <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
                <CircularProgress color="secondary" />
            </Box>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    if (!user.role || !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
