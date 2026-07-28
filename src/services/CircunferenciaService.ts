import axios from "axios";

const API_URL = import.meta.env.VITE_URL_API;

export const findAllCircunferencias = async () => {

    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/circunferencias`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

