import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from '../controller/categoryController.js';

const router = express.Router();

// Create a new category
router.post('/category', createCategory);

// Get all categories
router.get('/categories', getAllCategories);

// Get a single category by ID
router.get('/category/:id', getCategoryById);

// Update an existing category
router.put('/category/:id', updateCategory);

// Delete a category
router.delete('/category/:id', deleteCategory);

export default router;
