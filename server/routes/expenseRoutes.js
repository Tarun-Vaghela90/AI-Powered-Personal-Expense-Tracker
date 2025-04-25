import express from 'express';
import { fetchuser } from '../middleware/authMiddleware.js';
import {
  createExpense,
  getUserExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getTotalSumByUser,
  getGroupExpenses,
  getPersonalExpensesByCategory,
  getGroupExpensesByCategory // 👈 Import new controller function
} from '../controller/expenseController.js';

const router = express.Router();

// Protect these routes with the fetchuser middleware
router.post('/expenseCreate', fetchuser, createExpense);
router.get('/expensesfetch', fetchuser, getUserExpenses);
router.get('/expense/:id', fetchuser, getExpenseById);
router.put('/expense/:id', fetchuser, updateExpense);
router.delete('/expense/:id', fetchuser, deleteExpense);
router.get('/expenseTotal/:userId', fetchuser, getTotalSumByUser);
router.get('/expenseTotal/:userId', fetchuser, getGroupExpensesByCategory);

// ✅ New Route: Fetch group expenses
// router.get('/group/:groupId/category', fetchuser, getGroupExpenses);
router.get('/personal/category', fetchuser, getPersonalExpensesByCategory);

export default router;
