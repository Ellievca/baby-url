import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // check if there's alr a token in localStorage
    useEffect(() => {
        const token = localStorage.getItem('token');
        const stored = localStorage.getItem('user');

        if(token && stored) {
            setUser(JSON.parse(stored));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, []);

    // save token + user to localStorage and set auth header on all axios requests
    const login = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
    };

    // clear everything on logout
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);