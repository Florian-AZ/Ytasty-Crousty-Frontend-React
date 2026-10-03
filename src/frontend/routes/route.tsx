import { createBrowserRouter, Outlet } from "react-router";
import PrivateRoute from "./PrivateRoute.tsx";
import { Navigate } from "react-router-dom";
import App from "../pages/App.tsx";
import Header from "../components/Header.tsx";
import Connexion from "../pages/Connexion.tsx";
import GuestRoute from "./GuestRoute.tsx";
import ProtectedRoute from "./PrivateRoute.tsx";
import BackOffice from "../pages/BackOffice.tsx";
import CreateUser from "../pages/CreateUser.tsx";
import Produits from "../pages/Produits.tsx";

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
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
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/produits",
        element: <Produits />,
      },
      {
        path: "/test",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <Test />
          </PrivateRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <GuestRoute>
            <Connexion />
          </GuestRoute>
        ),
      },
      {
        path: "/connexion",
        element: <Navigate to="/login" replace />,
      },
      {
        path: "/back-office",
        element: (
          <ProtectedRoute allowedRoles={["staff", "admin", "direction"]}>
            <BackOffice />
          </ProtectedRoute>
        ),
      },
      {
        path: "/back-office/users/new",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <CreateUser />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default route;
