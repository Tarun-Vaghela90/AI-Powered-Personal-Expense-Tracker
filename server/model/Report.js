import mongoose from 'mongoose';
const { Schema } = mongoose;

const ReportSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: [{
    type: Schema.Types.ObjectId,
    ref: 'User'  // Reference to the Transaction collection
  }]
});

export default  mongoose.model('Report', ReportSchema);
