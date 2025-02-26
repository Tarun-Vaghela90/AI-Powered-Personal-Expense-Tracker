import mongoose from 'mongoose';

// Category Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [0, 'Budget must be a positive number'],
    }
  },
  { timestamps: true }
);

// Create and export the Category model
const Category = mongoose.model('Category', categorySchema);
export default Category;
