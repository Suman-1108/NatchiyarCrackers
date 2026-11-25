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
    const { status, search } = req.query;

    if (isDbConnected()) {
      const query = {};
      if (status && status !== 'ALL') {
        query.status = status;
      }
      if (search) {
        query.$or = [
          { orderRef: { $regex: search, $options: 'i' } },
          { 'customer.fullName': { $regex: search, $options: 'i' } },
          { 'customer.phone': { $regex: search, $options: 'i' } },
          { 'customer.district': { $regex: search, $options: 'i' } }
        ];
      }

      const orders = await Order.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, data: orders });
    }

    let filtered = [...ordersStore];
    if (status && status !== 'ALL') {
      filtered = filtered.filter(o => o.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(o =>
        o.orderRef?.toLowerCase().includes(q) ||
        o.customer?.fullName?.toLowerCase().includes(q) ||
        o.customer?.phone?.includes(q)
      );
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching orders', error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const id = req.params.id;
    if (isDbConnected()) {
      const order = await Order.findOne({ $or: [{ _id: id }, { orderRef: id }] });
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      return res.json({ success: true, data: order });
    }

    const order = ordersStore.find(o => o.orderRef === id || o._id === id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching order', error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    if (isDbConnected()) {
      const updateData = { status };
      if (notes) updateData['customer.notes'] = notes;

      const updated = await Order.findOneAndUpdate(
        { $or: [{ _id: id }, { orderRef: id }] },
        updateData,
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      return res.json({ success: true, message: `Order status updated to ${status}`, data: updated });
    }

    const order = ordersStore.find(o => o.orderRef === id || o._id === id);
    if (order) {
      order.status = status;
      return res.json({ success: true, message: `Order status updated to ${status}`, data: order });
    }

    res.status(404).json({ success: false, message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order status', error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;

    if (isDbConnected()) {
      const deleted = await Order.findOneAndDelete({ $or: [{ _id: id }, { orderRef: id }] });
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      return res.json({ success: true, message: 'Order deleted successfully' });
    }

    const index = ordersStore.findIndex(o => o.orderRef === id || o._id === id);
    if (index !== -1) {
      ordersStore.splice(index, 1);
      return res.json({ success: true, message: 'Order deleted successfully' });
    }

    res.status(404).json({ success: false, message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete order', error: error.message });
  }
};
