import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
});

// attach token automatically to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const auth = {
    register: (email, password) => api.post('/auth/register', { email, password }),
    login:    (email, password) => api.post('/auth/login', { email, password }),
};

export const urls = {
    create:    (data) => api.post('/urls', data),
    list:      () => api.get('/urls'),
    analytics: (code) => api.get(`/urls/${code}/analytics`),
    remove:    (code) => api.delete(`/urls/${code}`),
};