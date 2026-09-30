import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router/dom"
import './pages/css/index.css'
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import route from "./routes/route.tsx";
import ColorModeProvider from "./theme/colormodeprovider";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("L'élément #root est introuvable");
}

createRoot(rootElement).render(
  <Provider store={store}>
    <ColorModeProvider>
      <RouterProvider router={route} />
    </ColorModeProvider>
  </Provider>,
);