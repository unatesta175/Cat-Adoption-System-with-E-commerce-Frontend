import axios from 'axios';

// Use environment variable in production, fallback to relative path for dev
const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updatePreferences: (preferences) => api.put('/auth/preferences', preferences)
};

// Cats API
export const catsAPI = {
  getAllCats: () => api.get('/cats'),
  getCatById: (id) => api.get(`/cats/${id}`),
  createCat: (formData) => {
    return api.post('/cats', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateCat: (id, formData) => {
    return api.put(`/cats/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteCat: (id) => api.delete(`/cats/${id}`)
};

// Adoptions API
export const adoptionsAPI = {
  createPaymentIntent: (catId) => api.post('/adoptions/create-payment-intent', { catId }),
  purchaseAdoption: (adoptionData) => api.post('/adoptions/purchase', adoptionData),
  getMyRequests: () => api.get('/adoptions/my-requests'),
  getAllRequests: () => api.get('/adoptions'),
  updateStatus: (id, status) => api.put(`/adoptions/${id}/status`, { status })
};

// Recommendations API
export const recommendationsAPI = {
  getRecommendations: () => api.get('/recommendations')
};

// Products API
export const productsAPI = {
  getAllProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (formData) => {
    return api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateProduct: (id, formData) => {
    return api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteProduct: (id) => api.delete(`/products/${id}`)
};

// Orders API
export const ordersAPI = {
  createPaymentIntent: (items) => api.post('/orders/create-payment-intent', { items }),
  createOrder: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/my-orders'),
  getAllOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status })
};

export default api;




