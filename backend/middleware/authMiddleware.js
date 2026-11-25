import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { config } from '../config/config.js';
import { isDbConnected } from '../config/db.js';

export const protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Admin token missing.'
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    if (isDbConnected()) {
      const admin = await Admin.findById(decoded.id).select('-password');
      if (!admin) {
        return res.status(401).json({ success: false, message: 'Admin account not found or removed.' });
      }
      req.admin = admin;
    } else {
      // In-memory fallback
      if (decoded.username === config.admin.username) {
        req.admin = {
          _id: 'mock-admin-id',
          username: config.admin.username,
          email: config.admin.email,
          role: 'superadmin'
        };
      } else {
        return res.status(401).json({ success: false, message: 'Invalid admin credentials in offline mode.' });
      }
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired admin token.',
      error: err.message
    });
  }
};
