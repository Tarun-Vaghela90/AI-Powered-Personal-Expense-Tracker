import express from 'express';
import { fetchuser } from '../middleware/authMiddleware.js';
import {
  createExpense,
  getUserExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getTotalSumByUser,
} from '../controller/expenseController.js';

const router = express.Router();

// Protect these routes with the fetchuser middleware
router.post('/expenseCreate', fetchuser, createExpense);
router.get('/expensesfetch', fetchuser, getUserExpenses);
router.get('/expense/:id', fetchuser, getExpenseById);
router.put('/expense/:id', fetchuser, updateExpense);
router.delete('/expense/:id', fetchuser, deleteExpense);
router.get('/expenseTotal/:userId', fetchuser, getTotalSumByUser);


export default router;
