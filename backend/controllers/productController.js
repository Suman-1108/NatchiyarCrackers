import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { isDbConnected } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsDataPath = path.join(__dirname, '../data/products.json');
const categoriesDataPath = path.join(__dirname, '../data/categories.json');

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf-8'));

export const getProducts = async (req, res) => {
  try {
    const { category, search, sort } = req.query;

    if (isDbConnected()) {
      const query = {};
      if (category && category !== 'all') {
        query.category = category;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { categoryName: { $regex: search, $options: 'i' } }
        ];
      }

      let queryBuilder = Product.find(query);
      if (sort === 'price-low') {
        queryBuilder = queryBuilder.sort({ price: 1 });
      } else if (sort === 'price-high') {
        queryBuilder = queryBuilder.sort({ price: -1 });
      } else {
        queryBuilder = queryBuilder.sort({ no: 1 });
      }

      const products = await queryBuilder.lean();
      return res.json({ success: true, count: products.length, data: products });
    }

    // Fallback to local JSON file
    let products = readJson(productsDataPath);
    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q)
      );
    }
    if (sort === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    }

    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    if (isDbConnected()) {
      const product = await Product.findOne({ id: req.params.id }).lean();
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, data: product });
    }

    const products = readJson(productsDataPath);
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching product', error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    if (isDbConnected()) {
      const categories = await Category.find().sort({ _id: 1 }).lean();
      if (categories && categories.length > 0) {
        return res.json({ success: true, data: categories });
      }
    }

    const categories = readJson(categoriesDataPath);
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories', error: error.message });
  }
};
