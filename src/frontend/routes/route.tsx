import {createBrowserRouter, Outlet} from "react-router";
import PrivateRoute from "./PrivateRoute.tsx";
import {Navigate} from "react-router-dom";
import App from "../pages/App.tsx";
import Header from "../components/Header.tsx";
import Connexion from "../pages/Connexion.tsx";
import GuestRoute from "./GuestRoute.tsx";
import ProtectedRoute from "./PrivateRoute.tsx";
import BackOffice from "../pages/BackOffice.tsx";
import CreateUser from "../pages/CreateUser.tsx";
import Produits from "../pages/Produits.tsx";
import ValidationOrder from "../pages/ValidationOrder.tsx";
import OrderSuivi from "../pages/OrderSuivi.tsx";
import OrderRecherche from "../pages/OrderRecherche.tsx";
import GestionCarte from "../pages/GestionCarte.tsx";

const Layout = () => {
    return (
        <>
            <Header/>
            <Outlet/>
        </>
    );
};

function Test() {
    return (
        <>
            <p>Test</p>
        </>
    );
}

const route = createBrowserRouter([
        {
            element: <Layout/>,
            children: [
                {
                    path: "/",
                    element: <App/>
                },
                {
                    path: "/produits",
                    element: <Produits/>,
                },
                {
                    path: "/validation",
                    element: <ValidationOrder/>
                },
                {
                    path: "/order",
                    element: <OrderRecherche/>
                },
                {
                    path: "/order/:order_number",
                    element: <OrderSuivi/>
                },
                {
                    path: "/test",
                    element: <PrivateRoute allowedRoles={["admin"]}>
                        <Test/>
                    </PrivateRoute>
                },
                {
                    path: "/login",
                    element: <GuestRoute>
                        <Connexion/>
                    </GuestRoute>
                },
                {
                    path: "/connexion",
                    element: <Navigate to="/login" replace/>
                },
                {
                    path: "/back-office",
                    element: (
                        <ProtectedRoute allowedRoles={["staff", "admin", "direction"]}>
                            <BackOffice/>
                        </ProtectedRoute>
                    )
                },
                {
                    path: "/back-office/carte",
                    element: (
                        <ProtectedRoute allowedRoles={["admin", "staff"]}>
                            <GestionCarte/>
                        </ProtectedRoute>
                    )
                },
                {
                    path: "/back-office/users/new",
                    element:
                        (
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <CreateUser/>
                            </ProtectedRoute>
                        )
                }
                ,
            ]
        }
    ])
;

export default route
