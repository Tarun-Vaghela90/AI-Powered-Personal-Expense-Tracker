import mongoose from 'mongoose';

const { Schema } = mongoose;

const TransactionSchema = new Schema({
  budgetId: {  // Reference to the budget this transaction belongs to
    type: Schema.Types.ObjectId,
    ref: 'Budget',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],  // Transaction type
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Transaction', TransactionSchema);
