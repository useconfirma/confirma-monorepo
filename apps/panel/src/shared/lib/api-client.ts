import axios from 'axios';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        return Promise.reject(error);
    },
);
