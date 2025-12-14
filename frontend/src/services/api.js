import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
};

export const sweetsAPI = {
  getAll: () => apiClient.get('/sweets'),
  search: (params) => apiClient.get('/sweets/search', { params }),
  create: (formData) => {
    return axios.post(`${API_BASE_URL}/sweets`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
  },
  update: (id, data) => apiClient.patch(`/sweets/${id}`, data),
  delete: (id) => apiClient.delete(`/sweets/${id}`),
  purchase: (id, quantity) => apiClient.post(`/sweets/${id}/purchase`, { quantity }),
  restock: (id, quantity) => apiClient.post(`/sweets/${id}/restock`, { quantity }),
};

export default apiClient;