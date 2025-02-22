import express from 'express';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../controller/transcationController.js';

const router = express.Router();

// Route to get all transactions
router.get('/transactions', getTransactions);

// Route to create a new transaction
router.post('/transactions', createTransaction);

// Route to update a transaction by ID
router.put('/transactions/:id', updateTransaction);

// Route to delete a transaction by ID
router.delete('/transactions/:id', deleteTransaction);

export default router;
