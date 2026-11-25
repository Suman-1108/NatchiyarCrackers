import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  enquiryType: { type: String, default: 'General Enquiry' },
  message: { type: String, default: '' },
  status: { type: String, default: 'NEW' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);
export default Enquiry;
