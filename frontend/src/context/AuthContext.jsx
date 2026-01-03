// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ❗ Listen for refresh-token success (sent from axios interceptor)
    useEffect(() => {
        const handleTokenRefreshed = async () => {
            try {
                const res = await api.get('/developers/me');
                setUser(res.data.data);
            } catch (err) {
                setUser(null);
            }
        };

        window.addEventListener("token-refreshed", handleTokenRefreshed);

        return () => {
            window.removeEventListener("token-refreshed", handleTokenRefreshed);
        };
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get('/developers/me');
                setUser(res.data.data);
            } catch (err) {
                setUser(null);
                if (err.response?.status !== 401) {
                    console.error("Auth server error:", err.message);
                }
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const logout = async () => {
        try {
            await api.post('/developers/logout');
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setUser(null);
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {loading ? (
                <div className="flex h-screen items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};
