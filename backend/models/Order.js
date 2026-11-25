import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  tamilName: { type: String, default: '' },
  category: { type: String, default: '' },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  quantity: { type: Number, required: true },
  itemTotal: { type: Number, required: true },
  packSize: { type: String, default: '' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderRef: { type: String, required: true, unique: true },
  customer: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    secondaryPhone: { type: String, default: '' },
    district: { type: String, required: true },
    state: { type: String, default: 'Tamil Nadu' },
    address: { type: String, required: true },
    preferredTransport: { type: String, default: '' },
    notes: { type: String, default: '' }
  },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, default: 'AWAITING_TRANSPORT_CONFIRMATION' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
