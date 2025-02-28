import Expense from '../model/ExpenseModel.js';
import Category from '../model/categoryModel.js';
import mongoose from 'mongoose'; 
// Create a new expense
export const createExpense = async (req, res) => {
  try {
    const { name, note, type, amount, category } = req.body;

    // Ensure required fields are provided
    if (!name || !type || !amount || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Create new expense
    const expense = new Expense({
      name,
      note,
      type,
      amount,
      category,
      user: req.user.id, // The logged-in user ID (from the verified token)
    });

    await expense.save();
    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      expense,
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ message: 'Server error while creating expense' });
  }
};

// Get all expenses for a user
export const getUserExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).populate('category');
    res.status(200).json({
      success: true,
      expenses,
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Server error while fetching expenses' });
  }
};

// Get a specific expense by ID
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate('category');
    if (!expense || expense.user.toString() !== req.user.id.toString()) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }

    res.status(200).json({
      success: true,
      expense,
    });
  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({ message: 'Server error while fetching expense' });
  }
};

// Update an existing expense
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense || expense.user.toString() !== req.user.id.toString()) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }

    const { name, note, type, amount, category } = req.body;

    expense.name = name || expense.name;
    expense.note = note || expense.note;
    expense.type = type || expense.type;
    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;

    await expense.save();

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      expense,
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ message: 'Server error while updating expense' });
  }
};

// Delete an expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense || expense.user.toString() !== req.user.id.toString()) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }

    // Instead of using expense.remove(), use deleteOne
    await Expense.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Server error while deleting expense' });
  }
};

export const getTotalSumByUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Get the user ID from the request parameters

    // Aggregation pipeline to sum credits and debits separately for a specific user
    const totalSum = await Expense.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(userId) }, // Fix here: Use 'new mongoose.Types.ObjectId'
      },
      {
        $group: {
          _id: null, // No grouping by specific fields, we're just summing everything
          totalCredit: {
            $sum: {
              $cond: [{ $eq: ['$type', 'credit'] }, '$amount', 0], // Sum only credits
            },
          },
          totalDebit: {
            $sum: {
              $cond: [{ $eq: ['$type', 'debit'] }, '$amount', 0], // Sum only debits
            },
          },
        },
      },
    ]);

    // If no result, return 0 for both totals
    if (totalSum.length === 0) {
      return res.status(200).json({
        totalCredit: 0,
        totalDebit: 0,
      });
    }

    // Respond with the total credit and debit sums for the user
    res.status(200).json({
      totalCredit: totalSum[0].totalCredit,
      totalDebit: totalSum[0].totalDebit,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};