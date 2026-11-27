import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const adminClient = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Authorization Bearer token automatically
adminClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('snc_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Intercept 401 Unauthorized to trigger logout
adminClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (
        (window.location.pathname.startsWith('/portal/admin') || window.location.pathname.startsWith('/admin')) &&
        !window.location.pathname.includes('/login')
      ) {
        localStorage.removeItem('snc_admin_token');
        localStorage.removeItem('snc_admin_user');
        window.location.href = '/portal/admin/login?sessionExpired=true';
      }
    }
    return Promise.reject(error);
  }
);

export const adminApi = {
  // Authentication
  async login(username, password) {
    const res = await adminClient.post('/login', { username, password });
    return res.data;
  },

  async getProfile() {
    const res = await adminClient.get('/me');
    return res.data;
  },

  // Dashboard Stats
  async getStats() {
    const res = await adminClient.get('/stats');
    return res.data;
  },

  // Settings
  async getSettings() {
    const res = await adminClient.get('/settings');
    return res.data;
  },

  async updateSettings(settingsData) {
    const res = await adminClient.put('/settings', settingsData);
    return res.data;
  },

  // Products CRUD
  async getProducts(params = {}) {
    const res = await adminClient.get('/products', { params });
    return res.data;
  },

  async createProduct(productData) {
    const res = await adminClient.post('/products', productData);
    return res.data;
  },

  async updateProduct(id, productData) {
    const res = await adminClient.put(`/products/${id}`, productData);
    return res.data;
  },

  async deleteProduct(id) {
    const res = await adminClient.delete(`/products/${id}`);
    return res.data;
  },

  // Categories CRUD
  async getCategories() {
    const res = await adminClient.get('/categories');
    return res.data;
  },

  async createCategory(catData) {
    const res = await adminClient.post('/categories', catData);
    return res.data;
  },

  async updateCategory(id, catData) {
    const res = await adminClient.put(`/categories/${id}`, catData);
    return res.data;
  },

  async deleteCategory(id) {
    const res = await adminClient.delete(`/categories/${id}`);
    return res.data;
  },

  // Orders Management
  async getOrders(params = {}) {
    const res = await adminClient.get('/orders', { params });
    return res.data;
  },

  async getOrderById(id) {
    const res = await adminClient.get(`/orders/${id}`);
    return res.data;
  },

  async updateOrderStatus(id, status, notes = '') {
    const res = await adminClient.put(`/orders/${id}/status`, { status, notes });
    return res.data;
  },

  async deleteOrder(id) {
    const res = await adminClient.delete(`/orders/${id}`);
    return res.data;
  },

  // Enquiries & Wholesale Leads
  async getEnquiries() {
    const res = await adminClient.get('/enquiries');
    return res.data;
  },

  async deleteEnquiry(id) {
    const res = await adminClient.delete(`/enquiries/${id}`);
    return res.data;
  },

  async getWholesaleEnquiries() {
    const res = await adminClient.get('/wholesale-enquiries');
    return res.data;
  },

  async deleteWholesaleEnquiry(id) {
    const res = await adminClient.delete(`/wholesale-enquiries/${id}`);
    return res.data;
  }
};

export default adminApi;
