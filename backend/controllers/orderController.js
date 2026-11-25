import Order from '../models/Order.js';
import { isDbConnected } from '../config/db.js';

const ordersStore = [];

export const createOrderIntent = async (req, res) => {
  try {
    const { customer, items, subtotal, deliveryFee, total } = req.body;

    if (!customer || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid order payload.' });
    }

    const orderRef = `PM-ORD-${Date.now().toString().slice(-6)}`;
    const orderData = {
      orderRef,
      customer,
      items,
      subtotal,
      deliveryFee: deliveryFee || 0,
      total,
      status: 'AWAITING_TRANSPORT_CONFIRMATION',
      createdAt: new Date().toISOString()
    };

    if (isDbConnected()) {
      try {
        await Order.create(orderData);
        console.log('[ORDER SAVED TO MONGODB]', orderRef, customer.fullName);
      } catch (dbErr) {
        console.error('Failed to write order to MongoDB, falling back to memory:', dbErr.message);
        ordersStore.push(orderData);
      }
    } else {
      ordersStore.push(orderData);
      console.log('[ORDER REGISTERED IN-MEMORY]', orderRef, customer.fullName);
    }

    res.status(201).json({
      success: true,
      orderRef,
      message: 'Order registered. Sivakasi transport booking confirmation in progress.',
      requiresBackend: false
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error creating order', error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    if (isDbConnected()) {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, data: orders });
    }
    res.json({ success: true, count: ordersStore.length, data: ordersStore });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching orders', error: error.message });
  }
};
