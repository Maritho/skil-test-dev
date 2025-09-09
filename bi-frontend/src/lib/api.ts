// src/lib/api.ts
import axios from "axios";
import { loadingStore } from "./loadingStore";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
});

api.interceptors.request.use((config) => {
    loadingStore.getState().setLoading(true);
    return config;
});

api.interceptors.response.use(
    (response) => {
        loadingStore.getState().setLoading(false);
        return response;
    },
    (error) => {
        console.log(error);
        loadingStore.getState().setLoading(false);
        return Promise.reject(error);
    }
);

export default api;
