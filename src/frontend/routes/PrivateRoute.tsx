import type {ReactNode} from "react";
import {useSelector} from "react-redux";
import type {RootState} from "../store/store.ts";
import {Navigate} from "react-router-dom";


interface PrivateRouteProps {
    children: ReactNode;
    allowedRoles?: string[];
}

const PrivateRoute = ({children, allowedRoles}: PrivateRouteProps, ) => {
    const loggedUser = useSelector((state: RootState) => state.userLogged.userLogged)
    const loading = useSelector((state: RootState) => state.loading)
    if (loading.value) return <div>Loading...</div>
    const role = loggedUser?.role
    if (!loggedUser || !role) {
        return <Navigate to="/connexion" replace/>
    }
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/" replace/>

    }
    return <>{children}</>
}

export default PrivateRoute