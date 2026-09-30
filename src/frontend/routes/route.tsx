import { createBrowserRouter, Outlet } from "react-router";
import { Navigate } from "react-router-dom";
import App from "../pages/App.tsx";
import Header from "../components/Header.tsx";
import Connexion from "../pages/Connexion.tsx"
import GuestRoute from "./guestroute.tsx";
import ProtectedRoute from "./privateroute.tsx";
import BackOffice from "../pages/BackOffice.tsx";
import CreateUser from "../pages/CreateUser.tsx";

const Layout = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}

const route = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <App />
            },
            {
                path: "/login",
                element: <GuestRoute>
                    <Connexion />
                </GuestRoute>
            },
            {
                path: "/connexion",
                element: <Navigate to="/login" replace />
            },
            {
                path: "/back-office",
                element: (
                    <ProtectedRoute allowedRoles={["staff", "admin", "direction"]}>
                        <BackOffice />
                    </ProtectedRoute>
                )
            },
            {
                path: "/back-office/users/new",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <CreateUser />
                    </ProtectedRoute>
                )
            },
        ]
    }
]);

export default route
