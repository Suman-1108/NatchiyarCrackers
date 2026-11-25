import Wholesale from '../models/Wholesale.js';
import { isDbConnected } from '../config/db.js';

const wholesaleStore = [];

export const createWholesaleEnquiry = async (req, res) => {
  try {
    const {
      businessName,
      contactPerson,
      phone,
      email,
      categories,
      estimatedBudget,
      location,
      state,
      requirements
    } = req.body;

    if (!businessName || !contactPerson || !phone || !location) {
      return res.status(400).json({
        success: false,
        message: 'Business name, contact person, phone number, and location are required.'
      });
    }

    const record = {
      quoteRef: `SNC-B2B-${Date.now().toString().slice(-6)}`,
      businessName,
      contactPerson,
      phone,
      email: email || '',
      categories: categories || [],
      estimatedBudget: estimatedBudget || '₹50,000 - ₹1,00,000',
      location,
      state: state || 'Tamil Nadu',
      requirements: requirements || '',
      status: 'PENDING_TIER_QUOTATION',
      createdAt: new Date().toISOString()
    };

    if (isDbConnected()) {
      try {
        await Wholesale.create(record);
        console.log('[WHOLESALE SAVED TO MONGODB]', record.quoteRef, businessName);
      } catch (dbErr) {
        console.error('Failed to save wholesale to MongoDB, falling back to memory:', dbErr.message);
        wholesaleStore.push(record);
      }
    } else {
      wholesaleStore.push(record);
      console.log('[WHOLESALE B2B INQUIRY IN-MEMORY]', record);
    }

    res.status(201).json({
      success: true,
      message: 'Wholesale enquiry submitted! A dedicated Sivakasi B2B manager will contact you.',
      quoteRef: record.quoteRef
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getWholesaleEnquiries = async (req, res) => {
  try {
    if (isDbConnected()) {
      const records = await Wholesale.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: records.length, data: records });
    }
    res.json({ success: true, count: wholesaleStore.length, data: wholesaleStore });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching wholesale enquiries', error: error.message });
  }
};

export const deleteWholesaleEnquiry = async (req, res) => {
  try {
    const id = req.params.id;
    if (isDbConnected()) {
      await Wholesale.findOneAndDelete({ $or: [{ _id: id }, { quoteRef: id }] });
      return res.json({ success: true, message: 'Wholesale enquiry deleted' });
    }
    const idx = wholesaleStore.findIndex(w => w.quoteRef === id || w._id === id);
    if (idx !== -1) wholesaleStore.splice(idx, 1);
    res.json({ success: true, message: 'Wholesale enquiry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete wholesale enquiry', error: error.message });
  }
};
