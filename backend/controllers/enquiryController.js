import Enquiry from '../models/Enquiry.js';
import { isDbConnected } from '../config/db.js';

const enquiriesStore = [];

export const createEnquiry = async (req, res) => {
  try {
    const { name, phone, email, enquiryType, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required.' });
    }

    const enquiryRecord = {
      id: `ENQ-${Date.now().toString().slice(-6)}`,
      name,
      phone,
      email: email || '',
      enquiryType: enquiryType || 'General Enquiry',
      message: message || '',
      status: 'NEW',
      createdAt: new Date().toISOString()
    };

    if (isDbConnected()) {
      try {
        await Enquiry.create(enquiryRecord);
        console.log('[ENQUIRY SAVED TO MONGODB]', enquiryRecord.id, name);
      } catch (dbErr) {
        console.error('Failed to save enquiry to MongoDB, falling back to memory:', dbErr.message);
        enquiriesStore.push(enquiryRecord);
      }
    } else {
      enquiriesStore.push(enquiryRecord);
      console.log('[ENQUIRY STORED IN-MEMORY]', enquiryRecord);
    }

    res.status(201).json({
      success: true,
      message: 'Your enquiry has been received by our Sivakasi sales desk.',
      enquiryId: enquiryRecord.id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error processing enquiry', error: error.message });
  }
};

export const getEnquiries = async (req, res) => {
  try {
    if (isDbConnected()) {
      const enquiries = await Enquiry.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: enquiries.length, data: enquiries });
    }
    res.json({ success: true, count: enquiriesStore.length, data: enquiriesStore });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching enquiries', error: error.message });
  }
};
