import axios from "axios";

const API_URL = import.meta.env.VITE_URL_API;

export const http = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

http.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
});

http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && localStorage.getItem("token")) {
            localStorage.removeItem("token");
            window.dispatchEvent(new Event("session-expired"));
        }

        return Promise.reject(error);
    }
);

export { API_URL };
