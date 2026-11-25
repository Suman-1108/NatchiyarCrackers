import dotenv from 'dotenv';
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
    secondaryPhone: '9442701264',
    tertiaryPhone: '9363779531',
    whatsapp: '919994100905',
    email: process.env.STORE_EMAIL || 'sales@natchiyarcrackers.com',
  }
};
