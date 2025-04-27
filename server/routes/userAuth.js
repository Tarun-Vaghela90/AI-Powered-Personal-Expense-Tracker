import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../model/User.js'; // Import your User model
import { fetchuser } from '../middleware/authMiddleware.js'; // Custom middleware for verifying JWT

const router = express.Router();
const JWT_SECRET = "Tarun";

// Route 1: Create User using: POST "/api/auth/createuser". Doesn't require Auth
router.post('/register', [
  body('email', 'Invalid email').isEmail(),
  body('name', 'Invalid Name').isLength({min:3}),
  body('password', 'Password must be at least 3 characters long').isLength({ min: 3 }),
], async (req, res) => {
  // If there are validation errors, return a bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Check if user exists
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Sorry, a user with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // Create user
    user = await User.create({
      email: req.body.email,
      name: req.body.name,
      password: secPass,
    });

    const data = {
      user: {
        id: user.id,
      },
    };

    const authToken = jwt.sign(data, JWT_SECRET);

    res.json({ authToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occurred");
  }
});

//   user update route
router.post('/update/:id', [
  body('password', 'Password must be at least 3 characters long').isLength({ min: 3 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.params.id;
    const { password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update only the password
    const user = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occurred");
  }
});




// Route 2: Authenticate User using: POST "/api/auth/login".
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
  let success = false;

  // If there are validation errors, return a bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success, error: "Please try to login with correct credentials" });
    }
   
    
    const passwordCompare = await bcrypt.compare(password, user.password);


    if (!passwordCompare) {
      return res.status(400).json({ success, error: "Incorrect credentials" });
    }
    
    const data = {
      user: {
        id: user.id,
      },
    };
    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occurred");
  }
});

// Route 3: Get logged-in user's details using: POST "/api/auth/getuser". Requires login
router.post('/getuser', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occurred");
  }
});









export default router;
