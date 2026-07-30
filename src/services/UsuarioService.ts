import axios from "axios";

const API_URL = import.meta.env.VITE_URL_API;

export const findAllUsuariosProjetions = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/user/listar-usuarios-projetions`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}