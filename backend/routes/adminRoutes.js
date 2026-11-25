import express from 'express';
import {
  adminLogin,
  getAdminProfile,
  getDashboardStats,
  getStoreSettings,
  updateStoreSettings
} from '../controllers/adminController.js';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/productController.js';
import {
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} from '../controllers/orderController.js';
import {
  getEnquiries,
  deleteEnquiry
} from '../controllers/enquiryController.js';
import {
  getWholesaleEnquiries,
  deleteWholesaleEnquiry
} from '../controllers/wholesaleController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Public Auth Route ---
router.post('/login', adminLogin);

// Public settings route (for storefront header/checkout)
router.get('/settings/public', getStoreSettings);

// --- Protected Admin Routes ---
router.use(protectAdmin);

// Profile & KPI
router.get('/me', getAdminProfile);
router.get('/stats', getDashboardStats);

// Settings
router.get('/settings', getStoreSettings);
router.put('/settings', updateStoreSettings);

// Products
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Categories
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Orders
router.get('/orders', getOrders);
router.get('/orders/:id', getOrderById);
router.put('/orders/:id/status', updateOrderStatus);
router.delete('/orders/:id', deleteOrder);

// Enquiries & Wholesale Leads
router.get('/enquiries', getEnquiries);
router.delete('/enquiries/:id', deleteEnquiry);
router.get('/wholesale-enquiries', getWholesaleEnquiries);
router.delete('/wholesale-enquiries/:id', deleteWholesaleEnquiry);

export default router;
