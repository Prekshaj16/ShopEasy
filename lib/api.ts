import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh'),
};

// Products API
export const productsAPI = {
  getAll: (params?: any) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  getCategories: () => api.get('/products/categories'),
  search: (query: string, params?: any) => api.get(`/products/search/${query}`, { params }),
};

// Cart API
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data: any) => api.post('/cart/add', data),
  update: (data: any) => api.patch('/cart/update', data),
  remove: (productId: string) => api.delete(`/cart/remove/${productId}`),
  clear: () => api.delete('/cart/clear'),
  getSummary: () => api.get('/cart/summary'),
};

// Orders API
export const ordersAPI = {
  create: (data: any) => api.post('/orders', data),
  getAll: (params?: any) => api.get('/orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  cancel: (id: string, reason?: string) => api.patch(`/orders/${id}/cancel`, { reason }),
  track: (id: string) => api.get(`/orders/${id}/track`),
};

// Payment API
export const paymentAPI = {
  createOrder: (data: any) => api.post('/payment/create-order', data),
  verifyPayment: (data: any) => api.post('/payment/verify-payment', data),
  paymentFailed: (data: any) => api.post('/payment/payment-failed', data),
  getStatus: (orderId: string) => api.get(`/payment/status/${orderId}`),
};

// Users API
export const usersAPI = {
  updateProfile: (data: any) => api.patch('/users/profile', data),
  addAddress: (data: any) => api.post('/users/addresses', data),
  updateAddress: (id: string, data: any) => api.patch(`/users/addresses/${id}`, data),
  deleteAddress: (id: string) => api.delete(`/users/addresses/${id}`),
  getAddresses: () => api.get('/users/addresses'),
  addToWishlist: (productId: string) => api.post(`/users/wishlist/${productId}`),
  removeFromWishlist: (productId: string) => api.delete(`/users/wishlist/${productId}`),
  getWishlist: () => api.get('/users/wishlist'),
};

export default api;