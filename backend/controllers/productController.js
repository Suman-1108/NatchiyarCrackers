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

// Admin: Create Product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      categoryName,
      packSize,
      mrp,
      price,
      availability,
      stock,
      featured,
      tag,
      description
    } = req.body;

    if (!name || !mrp || !price) {
      return res.status(400).json({ success: false, message: 'Product Name, MRP, and Selling Price are required.' });
    }

    const mrpNum = Number(mrp);
    const priceNum = Number(price);
    const discount = mrpNum > priceNum ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;
    
    // Auto generate id & serial no
    let nextNo = 100;
    if (isDbConnected()) {
      const highest = await Product.findOne().sort({ no: -1 }).select('no').lean();
      if (highest && highest.no) {
        nextNo = highest.no + 1;
      }
    }
    const cleanId = req.body.id || `snc-${Date.now().toString().slice(-6)}`;

    const newProductData = {
      id: cleanId,
      no: nextNo,
      name,
      category: category || 'sparklers',
      categoryName: categoryName || 'Sparklers',
      packSize: packSize || '1 Box',
      mrp: mrpNum,
      price: priceNum,
      discount,
      availability: availability || 'In Stock',
      stock: stock !== undefined ? Number(stock) : 100,
      featured: Boolean(featured),
      tag: tag || '',
      description: description || ''
    };

    if (isDbConnected()) {
      const created = await Product.create(newProductData);
      return res.status(201).json({ success: true, message: 'Product added successfully!', data: created });
    }

    res.status(201).json({ success: true, message: 'Product registered in offline mode', data: newProductData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create product', error: error.message });
  }
};

// Admin: Update Product
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = { ...req.body };

    if (updates.mrp && updates.price) {
      const mrpNum = Number(updates.mrp);
      const priceNum = Number(updates.price);
      updates.discount = mrpNum > priceNum ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;
    }

    if (isDbConnected()) {
      const updated = await Product.findOneAndUpdate(
        { $or: [{ id: productId }, { _id: productId }] },
        updates,
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Product not found to update.' });
      }

      return res.json({ success: true, message: 'Product updated successfully!', data: updated });
    }

    res.json({ success: true, message: 'Product updated (offline mode)', data: updates });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product', error: error.message });
  }
};

// Admin: Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (isDbConnected()) {
      const deleted = await Product.findOneAndDelete({
        $or: [{ id: productId }, { _id: productId }]
      });

      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Product not found.' });
      }

      return res.json({ success: true, message: 'Product deleted successfully!' });
    }

    res.json({ success: true, message: 'Product deleted (offline mode).' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product', error: error.message });
  }
};

// Categories
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

// Admin: Create Category
export const createCategory = async (req, res) => {
  try {
    const { name, slug, tagline, description } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ success: false, message: 'Category Name and Slug are required.' });
    }

    const catData = {
      id: slug,
      name,
      slug,
      tagline: tagline || '',
      description: description || '',
      count: 0
    };

    if (isDbConnected()) {
      const created = await Category.create(catData);
      return res.status(201).json({ success: true, message: 'Category created!', data: created });
    }

    res.status(201).json({ success: true, message: 'Category created (offline)', data: catData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create category', error: error.message });
  }
};

// Admin: Update Category
export const updateCategory = async (req, res) => {
  try {
    const catId = req.params.id;
    if (isDbConnected()) {
      const updated = await Category.findOneAndUpdate(
        { $or: [{ id: catId }, { _id: catId }] },
        req.body,
        { new: true }
      );
      return res.json({ success: true, message: 'Category updated!', data: updated });
    }
    res.json({ success: true, message: 'Category updated (offline)' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update category', error: error.message });
  }
};

// Admin: Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const catId = req.params.id;
    if (isDbConnected()) {
      await Category.findOneAndDelete({ $or: [{ id: catId }, { _id: catId }] });
      return res.json({ success: true, message: 'Category deleted!' });
    }
    res.json({ success: true, message: 'Category deleted (offline)' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete category', error: error.message });
  }
};
