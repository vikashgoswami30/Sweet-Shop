import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
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

// Auth API
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
};

// Sweets API
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