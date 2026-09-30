import type {ReactNode} from "react";
import {useSelector} from "react-redux";
import type {RootState} from "../store/store.ts";
import {Navigate} from "react-router-dom";


interface GuestRouteProps {
    children: ReactNode;
}

const GuestRoute = ({children}: GuestRouteProps) => {
    const loggedUser = useSelector((state: RootState) => state.userLogged.userLogged)
    const loading = useSelector((state: RootState) => state.loading)
    if (loading.value) return <div>Loading...</div>
    return loggedUser ? <Navigate to="/profile" replace/> : <>{children}</>
}

export default GuestRoute