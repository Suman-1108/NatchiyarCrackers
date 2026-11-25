import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  no: { type: Number },
  name: { type: String, required: true },
  category: { type: String, required: true },
  categoryName: { type: String, required: true },
  packSize: { type: String, default: '' },
  mrp: { type: Number, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  rating: { type: String, default: '4.8' },
  reviewsCount: { type: Number, default: 0 },
  availability: { type: String, default: 'In Stock' },
  stock: { type: Number, default: 100 },
  featured: { type: Boolean, default: false },
  tag: { type: String, default: '' },
  soundLevel: { type: String, default: '' },
  duration: { type: String, default: '' },
  description: { type: String, default: '' },
  features: [{ type: String }]
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
