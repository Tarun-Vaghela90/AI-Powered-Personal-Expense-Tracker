import mongoose from 'mongoose';

// Expense Schema
const expenseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Expense name is required'],
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: [true, 'Expense type (credit/debit) is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be a positive number'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Linking to the User model
      required: true, // Ensuring the expense belongs to a user
    },
  },
  { timestamps: true }
);

// Create and export the Expense model
const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
