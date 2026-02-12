import axios from 'axios';

// Get the API base URL from environment or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Add JWT token to request headers if available
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Handle response errors
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, clear token and redirect to login (unless already on login/register)
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/login' || currentPath === '/register';
      
      if (!isAuthPage) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ============= Auth Endpoints =============

export const authAPI = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  getProfile: () => apiClient.get('/user/profile'),
  updateProfile: (userData) => apiClient.put('/user/profile', userData),
};

// ============= Transaction Endpoints =============

export const transactionAPI = {
  getAll: (params) => apiClient.get('/transactions', { params }),
  getByMonth: (month, year) => apiClient.get('/transactions/month', { params: { month, year } }),
  create: (data) => apiClient.post('/transactions', data),
  update: (id, data) => apiClient.put(`/transactions/${id}`, data),
  delete: (id) => apiClient.delete(`/transactions/${id}`),
};

// ============= Budget Endpoints =============

export const budgetAPI = {
  getAll: (params) => apiClient.get('/budgets', { params }),
  getByMonth: (month, year) => apiClient.get(`/budgets/month/${year}/${month}`),
  create: (data) => apiClient.post('/budgets', data),
  update: (id, data) => apiClient.put(`/budgets/${id}`, data),
  delete: (id) => apiClient.delete(`/budgets/${id}`),
};

// ============= Emergency Fund Endpoints =============

export const emergencyFundAPI = {
  get: () => apiClient.get('/emergency-fund'),
  update: (data) => apiClient.put('/emergency-fund', data),
  updateProgress: (amount) => apiClient.post('/emergency-fund/progress', { amount }),
};

// ============= Credit Card Endpoints =============

export const creditCardAPI = {
  getAll: () => apiClient.get('/credit-cards'),
  create: (data) => apiClient.post('/credit-cards', data),
  update: (id, data) => apiClient.put(`/credit-cards/${id}`, data),
  delete: (id) => apiClient.delete(`/credit-cards/${id}`),
};

export default apiClient;
