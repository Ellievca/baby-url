import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
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