// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://localhost:7028', // Your API URL
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add request interceptor for handling form data
instance.interceptors.request.use(config => {
    // For token endpoint requests, ensure proper content type
    if (config.url === '/api/Auth/token') {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    // Add auth token from localStorage if available
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
});

// Add response interceptor for error handling
instance.interceptors.response.use(
    response => response,
    error => {
        console.log('API Error:', error);

        // Only redirect on 401 if:
        // 1. Not a roles check request (prevents redirect loops)
        // 2. Not already on login page
        if (error.response &&
            error.response.status === 401 &&
            !error.config.url.includes('/api/Auth/roles') &&
            window.location.pathname !== '/login') {

            // Handle unauthorized
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default instance;