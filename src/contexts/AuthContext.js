import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on component mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Verify user's authentication status
    const checkAuthStatus = async () => {
        try {
            setLoading(true);

            // Check if we have a token first
            const token = localStorage.getItem('auth_token');
            if (!token) {
                setCurrentUser(null);
                setLoading(false);
                return;
            }

            const response = await axios.get('/api/Auth/roles');

            if (response.data.success) {
                const userData = response.data.data;

                // Only set user if they have Admin role
                if (userData.roles.includes('Admin')) {
                    setCurrentUser({
                        userId: userData.userId,
                        email: userData.email,
                        roles: userData.roles,
                    });
                } else {
                    // Clear current user if no admin role
                    setCurrentUser(null);
                }
            }
        } catch (error) {
            console.error('Authentication check failed:', error);
            // Don't clear token here, as we'll handle token refresh in axios interceptor
        } finally {
            setLoading(false);
        }
    };

    // Login function
    const login = async (email, password) => {
        try {
            // Create form data manually
            const formData = new URLSearchParams();
            formData.append('grant_type', 'password');
            formData.append('username', email);
            formData.append('password', password);
            formData.append('scope', 'api roles email offline_access');

            // First make token request
            const response = await axios.post('/api/Auth/token', formData.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            // Store both tokens in localStorage
            localStorage.setItem('auth_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);

            // Use token to fetch user roles
            const rolesResponse = await axios.get('/api/Auth/roles');

            // Check if user has admin role
            const userData = rolesResponse.data.data;
            if (!userData.roles.includes('Admin')) {
                throw new Error('Access denied. Admin privileges required.');
            }

            // Set user data
            setCurrentUser({
                userId: userData.userId,
                email: userData.email,
                roles: userData.roles,
            });

            return true;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await axios.post('/api/Auth/logout');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            setCurrentUser(null);
        } catch (error) {
            console.error('Logout error:', error);
            // Even if logout API fails, clear tokens and user state
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            setCurrentUser(null);
        }
    };

    const value = {
        currentUser,
        loading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);