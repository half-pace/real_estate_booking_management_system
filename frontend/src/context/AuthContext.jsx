import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            axios.defaults.baseURL = 'http://localhost:5000';
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const userData = localStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        }else {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        const response = await axios.post('/api/auth/login', { email, password });
        setToken(response.data.token);
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
    };

    const register = async (userData) => {
        const response = await axios.post('/api/auth/register', userData);
        setToken(response.data.token);
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};