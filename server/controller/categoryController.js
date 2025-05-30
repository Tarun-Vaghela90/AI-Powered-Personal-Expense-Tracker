// import Category from '../model/categoryModel.js';
import Expense from '../model/ExpenseModel.js';
import Category from '../model/categoryModel.js'; 
// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name, budget } = req.body;
       
    // Validate required fields
    if (!name || budget === undefined) {
      return res.status(400).json({ message: 'Name and Budget are required fields' });
    }

    // Create the new category with user ID from the token
    const newCategory = new Category({
      name,
      budget,
      user: req.user.id, // Attach the user ID from token
    });

    await newCategory.save();
    res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: err.errors });
    }
    res.status(500).json({ message: 'Error creating category', error: err.message });
  }
};

// Get all categories for the logged-in user
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id }); // Get categories for the logged-in user
    res.status(200).json({ categories });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories', error: err.message });
  }
};

// Get a single category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({ _id: id, user: req.user.id }); // Ensure the category belongs to the user

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ category });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching category', error: err.message });
  }
};

// Update an existing category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, budget } = req.body;

    // Validate required fields
    if (!name || budget === undefined) {
      return res.status(400).json({ message: 'Name and Budget are required fields' });
    }

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: id, user: req.user.id }, // Ensure the category belongs to the user
      { name, budget },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: err.errors });
    }
    res.status(500).json({ message: 'Error updating category', error: err.message });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findOneAndDelete({ _id: id, user: req.user.id }); // Ensure the category belongs to the user

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting category', error: err.message });
  }
};
