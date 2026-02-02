import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Feedback API endpoints
export const feedbackAPI = {
  // Get all feedback (admin)
  getAll: (params = {}) => api.get('/feedback', { params }),
  
  // Get approved feedback (public)
  getApproved: (params = {}) => api.get('/feedback/approved', { params }),
  
  // Submit new feedback
  submit: (data) => api.post('/feedback', data),
  
  // Update feedback status (admin)
  updateStatus: (id, status) => api.patch(`/feedback/${id}/status`, { status }),
  
  // Delete feedback (admin)
  delete: (id) => api.delete(`/feedback/${id}`),
  
  // Get feedback statistics
  getStats: () => api.get('/feedback/stats'),
};

// Auth API endpoints
export const authAPI = {
  // Admin login
  login: (credentials) => api.post('/admin/login', credentials),
  
  // Admin logout
  logout: () => api.post('/admin/logout'),
  
  // Get current user
  getUser: () => api.get('/admin/user'),
};

// Settings API endpoints
export const settingsAPI = {
  // Get settings (admin)
  get: () => api.get('/settings'),
  // Get public settings (for reviews page, home, submission form - no auth)
  getPublic: () => api.get('/settings/public'),
  // Update settings
  update: (data) => api.put('/settings', data),
};

export default api;
