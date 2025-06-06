import Expense from '../model/ExpenseModel.js';
import Category from '../model/categoryModel.js';
import Group from '../model/groupModel.js';
import mongoose from 'mongoose';


// ✅ CREATE EXPENSE (Personal or Group)
export const createExpense = async (req, res) => {
  try {
    const { name, note, type, amount, category, group } = req.body;

    if (!name || !type || !amount) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // If it's a group expense, verify group and membership
    if (group) {
      const groupDoc = await Group.findById(group);
      if (!groupDoc) {
        return res.status(404).json({ message: 'Group not found' });
      }

      const isMember = groupDoc.members.some(member => member.toString() === req.user.id);
      if (!isMember) {
        return res.status(403).json({ message: 'You are not a member of this group' });
      }
    }

    const expense = new Expense({
      name,
      note,
      type,
      amount,
      category: category || null,
      user: req.user.id,
      group: group || null,
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

// ✅ UPDATE EXPENSE
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Check permission for personal or group expense
    if (
      expense.user.toString() !== req.user.id &&
      (!expense.group || !(await Group.findOne({ _id: expense.group, members: req.user.id })))
    ) {
      return res.status(403).json({ message: 'Unauthorized to update this expense' });
    }

    const { name, note, type, amount, category } = req.body;

    // Update fields only if provided
    if (name !== undefined) expense.name = name;
    if (note !== undefined) expense.note = note;
    if (type !== undefined) expense.type = type;
    if (amount !== undefined) expense.amount = amount;
    if (category !== undefined) expense.category = category;

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

// ✅ GET
//  ALL PERSONAL EXPENSES
export const getUserExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user.id,
      group: null
    }).populate('category');

    res.status(200).json({
      success: true,
      expenses,
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Server error while fetching expenses' });
  }
};

// ✅ GET GROUP EXPENSES
export const getGroupExpenses = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const isMember = group.members.some(member => member.toString() === req.user.id);
    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this group' });
    }

    const expenses = await Expense.find({ group: req.params.groupId })
    .populate('category')
    .populate('user', 'name'); // populate 'user' and only include the 'name' field
  

    res.status(200).json({
      success: true,
      expenses,
    });
  } catch (error) {
    console.error('Error fetching group expenses:', error);
    res.status(500).json({ message: 'Server error while fetching group expenses' });
  }
};


// ✅ GET EXPENSE BY ID
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate('category');

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (
      expense.user.toString() !== req.user.id &&
      (!expense.group || !(await Group.findOne({ _id: expense.group, members: req.user.id })))
    ) {
      return res.status(403).json({ message: 'Unauthorized to view this expense' });
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

// ✅ UPDATE EXPENSE

// ✅ DELETE EXPENSE
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (
      expense.user.toString() !== req.user.id &&
      (!expense.group || !(await Group.findOne({ _id: expense.group, members: req.user.id })))
    ) {
      return res.status(403).json({ message: 'Unauthorized to delete this expense' });
    }

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

// ✅ GET TOTAL SUM OF PERSONAL EXPENSES (Credit & Debit)
export const getTotalSumByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const totalSum = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          group: null,
        },
      },
      {
        $group: {
          _id: null,
          totalCredit: {
            $sum: {
              $cond: [{ $eq: ['$type', 'credit'] }, '$amount', 0],
            },
          },
          totalDebit: {
            $sum: {
              $cond: [{ $eq: ['$type', 'debit'] }, '$amount', 0],
            },
          },
        },
      },
    ]);

    if (totalSum.length === 0) {
      return res.status(200).json({
        totalCredit: 0,
        totalDebit: 0,
      });
    }

    res.status(200).json({
      totalCredit: totalSum[0].totalCredit,
      totalDebit: totalSum[0].totalDebit,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ GET TOTAL SUM OF GROUP EXPENSES
export const getTotalSumByGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const isMember = group.members.some(member => member.toString() === req.user.id);
    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this group' });
    }

    const totalSum = await Expense.aggregate([
      {
        $match: {
          group: new mongoose.Types.ObjectId(groupId),
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      totalSum: totalSum[0]?.totalAmount || 0,
    });
  } catch (error) {
    console.error('Error calculating group expenses total sum:', error);
    res.status(500).json({ message: 'Server error while calculating group total' });
  }
};


// ✅ GET PERSONAL EXPENSES GROUPED BY CATEGORY WITH TOTAL DEBIT
export const getPersonalExpensesByCategory = async (req, res) => {
  try {
    const userId = req.user.id;

    const expensesByCategory = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          group: null,
          type: 'debit', // Only consider debit expenses
        },
      },
      {
        $lookup: {
          from: 'categories', // The name of the category collection
          localField: 'category',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $unwind: {
          path: '$categoryDetails',
          preserveNullAndEmptyArrays: true, // Handle expenses without a category
        },
      },
      {
        $group: {
          _id: '$categoryDetails.name', // Group by category name
          totalDebit: { $sum: '$amount' },
          expenses: { $push: '$$ROOT' }, // Include all expenses in the group
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          totalDebit: 1,
          expenses: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      expensesByCategory,
    });
  } catch (error) {
    console.error('Error fetching personal expenses by category:', error);
    res.status(500).json({ message: 'Server error while fetching expenses by category' });
  }
};

// ✅ GET GROUP EXPENSES GROUPED BY CATEGORY WITH TOTAL DEBIT
export const getGroupExpensesByCategory = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const isMember = group.members.some(member => member.toString() === userId);
    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this group' });
    }

    const expensesByCategory = await Expense.aggregate([
      {
        $match: {
          group: new mongoose.Types.ObjectId(groupId),
          type: 'debit', // Only consider debit expenses
        },
      },
      {
        $lookup: {
          from: 'categories', // The name of the category collection
          localField: 'category',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $unwind: {
          path: '$categoryDetails',
          preserveNullAndEmptyArrays: true, // Handle expenses without a category
        },
      },
      {
        $group: {
          _id: '$categoryDetails.name', // Group by category name
          totalDebit: { $sum: '$amount' },
          expenses: { $push: '$$ROOT' }, // Include all expenses in the group
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          totalDebit: 1,
          expenses: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      expensesByCategory,
    });
  } catch (error) {
    console.error('Error fetching group expenses by category:', error);
    res.status(500).json({ message: 'Server error while fetching group expenses by category' });
  }
};