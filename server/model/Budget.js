import mongoose from 'mongoose';
const { Schema } = mongoose;

const BudgetSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  minAmount: {
    type: Number,
    required: true,
    min: [0, 'Minimum amount cannot be negative']
  },
  maxAmount: {
    type: Number,
    required: true,
    min: [0, 'Maximum amount cannot be negative']
  },
  currentAmount: {
    type: Number,
    required: true,
    min: [0, 'Current amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'INR', 'GBP', 'JPY']
  },
  date: {
    type: Date,
    default: Date.now
  },
  transactions: [{
    type: Schema.Types.ObjectId,
    ref: 'Transaction'  // Reference to the Transaction collection
  }]
});

export default  mongoose.model('Budget', BudgetSchema);
