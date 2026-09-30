import { createBrowserRouter, Outlet } from "react-router";
import App from "../pages/App.tsx";
import Header from "../components/Header.tsx";

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
        ]
    }
]);

export default route