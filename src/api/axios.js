import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://localhost:7028', // Your API URL
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
// Store all requests that should be retried after token refresh
let refreshSubscribers = [];

// Helper function to process queued requests
const onRefreshed = (accessToken) => {
    refreshSubscribers.forEach(callback => callback(accessToken));
    refreshSubscribers = [];
};

// Helper function to add request to queue
const addRefreshSubscriber = (callback) => {
    refreshSubscribers.push(callback);
};

// Function to refresh the access token using refresh token
const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        // Create form data for refresh token request
        const formData = new URLSearchParams();
        formData.append('grant_type', 'refresh_token');
        formData.append('refresh_token', refreshToken);
        formData.append('scope', 'offline_access api roles email');

        // Make the refresh token request
        const response = await axios.post('https://localhost:7028/api/Auth/token', formData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        // Store new tokens
        localStorage.setItem('auth_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);

        return response.data.access_token;
    } catch (error) {
        console.error('Token refresh failed:', error);
        // Clear tokens and redirect to login if refresh fails
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return null;
    }
};

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

// Add response interceptor for error handling and token refresh
instance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // Only try to refresh if:
        // 1. Error is 401 Unauthorized
        // 2. The original request is not the token refresh request itself
        // 3. We haven't already tried to refresh for this request
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest.url?.includes('/api/Auth/token') &&
            !originalRequest._retry
        ) {
            if (isRefreshing) {
                // If we're already refreshing, add this request to the queue
                try {
                    const accessToken = await new Promise((resolve, reject) => {
                        addRefreshSubscriber(token => {
                            if (token) {
                                resolve(token);
                            } else {
                                reject(new Error('Failed to refresh token'));
                            }
                        });
                    });
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                    return instance(originalRequest);
                } catch (refreshError) {
                    console.error('Failed waiting for token refresh:', refreshError);
                    return Promise.reject(refreshError);
                }
            }

            // Mark that we're refreshing a token and this request is being retried
            isRefreshing = true;
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const accessToken = await refreshAccessToken();

                if (accessToken) {
                    // Update the header for this request
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                    // Process any queued requests with the new token
                    onRefreshed(accessToken);

                    // Reset refreshing flag
                    isRefreshing = false;

                    // Retry the original request with the new token
                    return instance(originalRequest);
                }
            } catch (refreshError) {
                console.error('Token refresh attempt failed:', refreshError);
                isRefreshing = false;
                return Promise.reject(refreshError);
            }
        }

        // If not a token issue or refresh failed, redirect appropriate pages
        if (error.response && error.response.status === 401) {
            // Handle unauthorized - don't redirect for roles check to prevent loops
            if (!error.config.url.includes('/api/Auth/roles') &&
                window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default instance;