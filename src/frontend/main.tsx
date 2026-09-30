import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router/dom"
import './pages/css/App.css'
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import route from "./routes/route.tsx";
import type { User } from "./types/user.ts";
import { setUsers } from "./store/reducers/users.ts";
import type { Restaurant } from "./types/restaurant.ts";
import { setRestaurants } from "./store/reducers/restaurants.ts";
import { setProduct } from "./store/reducers/products.ts";
import type { Product } from "./types/produit.ts";
import { setLoading } from "./store/reducers/loading.ts";
import { setUserLogged } from "./store/reducers/userLogged.ts";
import ColorModeProvider from "./theme/colormodeprovider";
import { api } from "./services/api";
import { restoreAuthenticatedUser } from "./services/auth";

async function getUsers() {
    try {
        const response = await api.get<User[]>("/users");
        store.dispatch(setUsers(response.data))
        console.log("axios : appel users")
    } catch (e) {
        console.log(e);
    }
}

async function getRestaurants() {
    try {
        const response = await api.get<Restaurant[]>("/restaurants");
        store.dispatch(setRestaurants(response.data))
        console.log("axios : appel restaurants")
    } catch (e) {
        console.log(e);
    }
}

async function getProducts() {
    try {
        const response = await api.get<Product[]>("/products");
        store.dispatch(setProduct(response.data))
        console.log("axios : appel products ")
    } catch (e) {
        console.log(e);
    }
}

const restoredUser = restoreAuthenticatedUser();

if (restoredUser) {
    store.dispatch(setUserLogged(restoredUser));
}

async function bootstrap() {
    const requests: Promise<void>[] = [getRestaurants(), getProducts()];

    if (restoredUser?.role === "admin") {
        requests.push(getUsers());
    }

    try {
        await Promise.all(requests);
    } finally {
        store.dispatch(setLoading(false));
    }
}

void bootstrap();

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <ColorModeProvider>
        <RouterProvider router={route} />
        </ColorModeProvider>
    </Provider>
)
