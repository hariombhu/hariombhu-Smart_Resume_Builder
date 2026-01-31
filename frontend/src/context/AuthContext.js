'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Check for stored token on mount
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            fetchUser(storedToken);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async (authToken) => {
        try {
            // No need to pass headers manually - api.js interceptor handles it
            const response = await api.get('/auth/me');
            setUser(response.data.data);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            // Don't logout on initial load error - token might just be expired
            localStorage.removeItem('token');
            setToken(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { user: userData, token: authToken } = response.data.data;

            localStorage.setItem('token', authToken);
            setToken(authToken);
            setUser(userData);

            toast.success('Login successful!');

            // Redirect based on role
            if (userData.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }

            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await api.post('/auth/register', { name, email, password });
            const { user: userData, token: authToken } = response.data.data;

            localStorage.setItem('token', authToken);
            setToken(authToken);
            setUser(userData);

            toast.success('Registration successful!');
            router.push('/dashboard');

            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        toast.success('Logged out successfully');
        router.push('/login');
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await api.put('/auth/update-profile', profileData);
            setUser(response.data.data);
            toast.success('Profile updated successfully');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Update failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
