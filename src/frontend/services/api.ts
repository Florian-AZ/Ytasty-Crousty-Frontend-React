import axios from "axios";

import { ACCESS_TOKEN_KEY } from "./auth";

export const API_URL =
    import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
});
