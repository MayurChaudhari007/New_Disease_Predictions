import axios from 'axios';
import toast from 'react-hot-toast';

// Get base URL strictly from Vite environment variable
const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor to handle global errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (!error.response) {
            toast.error('Network error. Is the backend offline?');
        } else if (error.response.status === 401) {
            // Auto logout if 401 response returned from api
            if (localStorage.getItem('token')) {
                toast.error('Session expired. Please log in again.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        } else if (error.response.status >= 500) {
            toast.error('Internal Server Error. Please try again later.');
        }
        return Promise.reject(error);
    }
);

export default api;
