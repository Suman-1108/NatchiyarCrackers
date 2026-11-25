import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load backend/.env first, then root .env if present
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/natchiyar_crackers',
  store: {
    name: 'SRI NATCHIYAR CRACKERS',
    tamilName: 'ஸ்ரீ நாச்சியார் பட்டாசு கடை',
    tagline: 'சிவகாசி கம்பெனியின் நேரடி விற்பனை',
    city: process.env.STORE_CITY || 'Sivakasi',
    state: process.env.STORE_STATE || 'Tamil Nadu',
    phone: process.env.STORE_PHONE || '9994100905',
    secondaryPhone: process.env.STORE_PHONE_2 || '9442701264',
    tertiaryPhone: process.env.STORE_PHONE_3 || '9363779531',
    whatsapp: '919994100905',
    email: process.env.STORE_EMAIL || 'sales@natchiyarcrackers.com',
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
    user: process.env.SMTP_USER || 'hellosuman29@gmail.com',
    pass: process.env.SMTP_PASS || '',
    fromName: (process.env.EMAIL_FROM_NAME || 'Natchiyar crackers').trim(),
    fromAddress: process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER || 'hellosuman29@gmail.com'
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    mode: process.env.RAZORPAY_MODE || 'test'
  },
  geoapify: {
    apiKey: process.env.GEOAPIFY_API_KEY || ''
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || ''
  }
};

export default config;
