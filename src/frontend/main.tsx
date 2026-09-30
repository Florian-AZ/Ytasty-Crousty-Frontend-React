import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router/dom"
import './pages/css/index.css'
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import route from "./routes/route.tsx";
import type {User} from "./types/user.ts";
import {setUsers} from "./store/reducers/users.ts";
import axios from "axios";
import type {Restaurant} from "./types/restaurant.ts";
import {setRestaurants} from "./store/reducers/restaurants.ts";
import {setProduct} from "./store/reducers/products.ts";
import type {Product} from "./types/produit.ts";
import {setLoading} from "./store/reducers/loading.ts";

const API_URL = "http://127.0.0.1:8000"

interface UsersResponse {
    users: User[];
}

async function getUsers() {
    try {
        const url = `${API_URL} + /users`
        const response = await axios.get<UsersResponse>(url);
        store.dispatch(setUsers(response.data.users))
        console.log("axios : appel users")
    } catch (e) {
        console.log(e);
    }
}

interface RestaurantsResponse {
    restaurants: Restaurant[];
}

async function getRestaurants() {
    try {
        const url = `${API_URL} + /restaurants`
        const response = await axios.get<RestaurantsResponse>(url);
        store.dispatch(setRestaurants(response.data.restaurants))
        console.log("axios : appel restaurants")
    } catch (e) {
        console.log(e);
    }
}

interface ProductsResponse {
    products: Product[];
}

async function getProducts() {
    try {
        const url = `${API_URL} + /products`
        const response = await axios.get<ProductsResponse>(url);
        store.dispatch(setProduct(response.data.products))
        console.log("axios : appel products ")
    } catch (e) {
        console.log(e);
    }
}

Promise.all([getUsers(), getRestaurants(), getProducts()]).catch((e) =>
    console.log(e)
).finally(() =>
    store.dispatch(setLoading(false))
)

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <RouterProvider router={route} />
    </Provider>
)