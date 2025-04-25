import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  
} from '../controller/categoryController.js';
import { fetchuser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new category
router.post('/categorycreate',fetchuser, createCategory);

// Get all categories
router.get('/allcategories',fetchuser, getAllCategories);


// Get a single category by ID
router.get('/category/:id',fetchuser, getCategoryById);

// Update an existing category
router.put('/category/:id',fetchuser, updateCategory);

// Delete a category
router.delete('/category/:id',fetchuser, deleteCategory);

export default router;
