// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Password is required only for manual users
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Ensures that either googleId or password is set, but not both
    },
    picture: {
      type: String,
    },
  },
  { timestamps: true }
);

// Hash the password before saving for manual users
userSchema.pre('save', async function (next) {
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10); // Hash password before saving
  }
  next();
});

// Method to compare password for manual users
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
