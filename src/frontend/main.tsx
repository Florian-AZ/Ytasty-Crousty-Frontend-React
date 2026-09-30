import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import App from './pages/App';

const router = createBrowserRouter([
    {
        children: [{
            path: '/',
            element: <App />,
        }]
    }
]);

createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
);


