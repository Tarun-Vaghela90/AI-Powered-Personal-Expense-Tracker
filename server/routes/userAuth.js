import express from 'express';
import User from '../model/User.js'; // Import your User model
import bcrypt from 'bcryptjs'; // For password hashing
import { body, validationResult } from 'express-validator'; // For input validation
import passport from 'passport';
import { fetchuser } from '../middleware/authMiddleware.js'; // Custom middleware for verifying JWT

const router = express.Router();

// Manual user registration route (name, email, and password)
router.post(
  '/register',
  [
    // Validate the name
    body('name').isLength({ min: 3 }).withMessage('Name should have at least 3 characters'),
    // Validate the email
    body('email').isEmail().withMessage('Please enter a valid email address'),
    // Validate the password
    body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters'),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });

      // Save the user to the database
      await newUser.save();

      // Send success response
      res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);
// Manual login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    req.login(user, (err) => {
      if (err) return res.status(500).json({ msg: 'Login failed' });
      return res.status(200).json({ msg: 'Login successful', user });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Google OAuth login (ensure the user is authenticated)
router.get('/google/success', (req, res) => {
  if (req.user) {
    return res.status(200).json({ success: true, user: req.user });
  }
  res.status(403).json({ success: false, msg: 'Not authenticated' });
});

// Protected route for manual and Google authenticated users
router.get('/profile', fetchuser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});




export default router;
