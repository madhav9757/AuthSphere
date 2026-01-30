import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);

    // ✅ LISTEN FOR TOKEN REFRESH SUCCESS
    useEffect(() => {
        const handleTokenRefreshed = async () => {
            try {
                const res = await api.get('/developers/me');
                if (res.data.success) {
                    setUser(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch user after token refresh:", err);
                setUser(null);
            }
        };

        window.addEventListener("token-refreshed", handleTokenRefreshed);

        return () => {
            window.removeEventListener("token-refreshed", handleTokenRefreshed);
        };
    }, []);

    // ✅ LISTEN FOR AUTH FAILURE (TOKEN REFRESH FAILED)
    useEffect(() => {
        const handleAuthFailed = () => {
            setUser(null);
        };

        window.addEventListener("auth-failed", handleAuthFailed);

        return () => {
            window.removeEventListener("auth-failed", handleAuthFailed);
        };
    }, []);

    // ✅ INITIAL AUTH CHECK
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get('/developers/me');
                if (res.data.success) {
                    setUser(res.data.data);
                } else {
                    setUser(null);
                }
            } catch (err) {
                setUser(null);
                // Only log non-401 errors
                if (err.response?.status !== 401) {
                    console.error("Auth check failed:", err.message);
                }
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const logout = async () => {
        setLoggingOut(true);
        try {
            await api.post('/developers/logout');
        } catch (error) {
            console.error("Logout request failed:", error);
        } finally {
            setUser(null);
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, setUser, loggingOut }}>
            {loading ? (
                <div className="flex h-screen items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="text-sm text-gray-600">Loading...</p>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};