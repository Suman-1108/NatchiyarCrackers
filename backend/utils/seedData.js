import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
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

    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0 && fs.existsSync(categoriesPath)) {
      const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));
      await Category.insertMany(categoriesData);
      console.log(`✨ Seeded ${categoriesData.length} categories to MongoDB`);
    }

    const productCount = await Product.countDocuments();
    if (productCount === 0 && fs.existsSync(productsPath)) {
      const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
      await Product.insertMany(productsData);
      console.log(`✨ Seeded ${productsData.length} products to MongoDB`);
    }
  } catch (error) {
    console.error(`⚠️ Error seeding MongoDB:`, error.message);
  }
};

export default seedDatabase;
