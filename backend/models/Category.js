import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  count: { type: Number, default: 0 },
  icon: { type: String, default: 'Sparkles' },
  tagline: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  gradient: { type: String, default: '' }
}, { timestamps: true });

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
export default Category;
