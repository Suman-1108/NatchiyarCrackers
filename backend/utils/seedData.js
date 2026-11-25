import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Admin from '../models/Admin.js';
import Setting from '../models/Setting.js';
import { config } from '../config/config.js';
import { isDbConnected } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const seedDatabase = async () => {
  if (!isDbConnected()) {
    return;
  }

  try {
    const productsPath = path.join(__dirname, '../data/products.json');
    const categoriesPath = path.join(__dirname, '../data/categories.json');

    // 1. Seed Categories
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0 && fs.existsSync(categoriesPath)) {
      const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));
      await Category.insertMany(categoriesData);
      console.log(`✨ Seeded ${categoriesData.length} categories to MongoDB`);
    }

    // 2. Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0 && fs.existsSync(productsPath)) {
      const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
      await Product.insertMany(productsData);
      console.log(`✨ Seeded ${productsData.length} products to MongoDB`);
    }

    // 3. Seed Default Admin
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await Admin.create({
        username: config.admin.username,
        email: config.admin.email,
        password: config.admin.password, // Pre-save hook will hash it with bcrypt
        role: 'superadmin'
      });
      console.log(`🛡️ Seeded default Superadmin: ${config.admin.username}`);
    }

    // 4. Seed Default Settings
    const defaultSettings = [
      {
        key: 'store_phones',
        value: {
          primary: config.store.phone,
          secondary: config.store.secondaryPhone,
          tertiary: config.store.tertiaryPhone,
          whatsapp: config.store.whatsapp
        },
        description: 'Store direct customer service hotline and WhatsApp contact numbers'
      },
      {
        key: 'min_order_amount',
        value: 3000,
        description: 'Minimum order amount in INR required for parcel transport checkout'
      },
      {
        key: 'announcement_banner',
        value: {
          enabled: true,
          badgeText: 'Wholesale & Retail Orders',
          tamilTagline: 'சிவகாசி கம்பெனியின் நேரடி விற்பனை',
          subtitle: '100% Legal PESO Green Crackers & Fresh 2026 Stock • Pan-India Fast Transport Delivery'
        },
        description: 'Top running header ticker and announcements'
      }
    ];

    for (const s of defaultSettings) {
      const exists = await Setting.findOne({ key: s.key });
      if (!exists) {
        await Setting.create(s);
      }
    }
  } catch (error) {
    console.error(`⚠️ Error seeding MongoDB:`, error.message);
  }
};

export default seedDatabase;
