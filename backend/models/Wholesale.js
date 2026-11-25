import mongoose from 'mongoose';

const wholesaleSchema = new mongoose.Schema({
  quoteRef: { type: String, required: true, unique: true },
  businessName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  categories: [{ type: String }],
  estimatedBudget: { type: String, default: '₹50,000 - ₹1,00,000' },
  location: { type: String, required: true },
  state: { type: String, default: 'Tamil Nadu' },
  requirements: { type: String, default: '' },
  status: { type: String, default: 'PENDING_TIER_QUOTATION' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Wholesale = mongoose.models.Wholesale || mongoose.model('Wholesale', wholesaleSchema);
export default Wholesale;
