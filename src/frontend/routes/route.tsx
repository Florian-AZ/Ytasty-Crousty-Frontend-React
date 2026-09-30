import {createBrowserRouter, Outlet} from "react-router";
import App from "../pages/App.tsx";
import Header from "../components/Header.tsx";
import PrivateRoute from "./PrivateRoute.tsx";
import ValidationOrder from "../pages/ValidationOrder.tsx";

const Layout = () => {
    return (
        <>
            <Header/>
            <Outlet/>
        </>
    )
}

function Test() {
    return <>
        <p>Test</p>
    </>;
}

const route = createBrowserRouter([
    {
        element: <Layout/>,
        children: [
            {
                path: "/",
                element: <App/>
            },{
                path: "/validation",
                element: <ValidationOrder/>
            },
            {
                path: "/test",
                element: <PrivateRoute allowedRoles={["admin"]}>
                    <Test/>
                </PrivateRoute>
            },
        ]
    }
]);

export default route