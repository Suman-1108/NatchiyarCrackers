import Order from '../models/Order.js';
import { isDbConnected } from '../config/db.js';
import { sendOrderConfirmationEmail } from '../services/emailService.js';

const ordersStore = [];

export const createOrderIntent = async (req, res) => {
  try {
    const { customer, items, subtotal, deliveryFee, total } = req.body;

    if (!customer || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid order payload.' });
    }

    const orderRef = `SNC-ORD-${Date.now().toString().slice(-6)}`;
    const formattedCustomer = {
      fullName: customer.fullName || '',
      phone: customer.mobileNumber || customer.phone || '',
      mobileNumber: customer.mobileNumber || customer.phone || '',
      email: (customer.email || '').trim(),
      address: customer.address || '',
      district: customer.district || '',
      state: customer.state || 'Tamil Nadu',
      pincode: customer.pincode || '',
      preferredTransport: customer.preferredTransport || '',
      notes: customer.orderNotes || customer.notes || '',
      paymentPreference: customer.paymentPreference || 'cash_on_hub_delivery'
    };

    const orderData = {
      orderRef,
      customer: formattedCustomer,
      items: items.map(i => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        itemTotal: i.itemTotal || (i.price * i.quantity),
        packSize: i.packSize || ''
      })),
      subtotal,
      deliveryFee: deliveryFee || 0,
      total,
      status: 'AWAITING_TRANSPORT_CONFIRMATION',
      emailSent: false,
      createdAt: new Date().toISOString()
    };

    let savedOrder = null;
    if (isDbConnected()) {
      try {
        savedOrder = await Order.create(orderData);
        console.log('[ORDER SAVED TO MONGODB]', orderRef, formattedCustomer.fullName);
      } catch (dbErr) {
        console.error('Failed to write order to MongoDB, falling back to memory:', dbErr.message);
        ordersStore.push(orderData);
      }
    } else {
      ordersStore.push(orderData);
      console.log('[ORDER REGISTERED IN-MEMORY]', orderRef, formattedCustomer.fullName);
    }

    // Trigger Order Confirmation Email (Asynchronous)
    sendOrderConfirmationEmail(orderData).then(async (result) => {
      if (result.success && savedOrder) {
        await Order.updateOne({ _id: savedOrder._id }, { emailSent: true }).catch(() => {});
      }
    }).catch(err => {
      console.error('Error sending order confirmation email:', err.message);
    });

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
