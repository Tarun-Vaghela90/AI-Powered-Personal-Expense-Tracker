import express, { json } from 'express';
import session from 'express-session';
import passport from 'passport';
import googleRoutes from './routes/googleAuth.js';  // Assuming your auth routes are defined here
import userAuth from './routes/userAuth.js';
import expenseRoutes from './routes/expenseRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cors from 'cors';
import mongoose from 'mongoose'; // Import mongoose to connect to MongoDB
import dotenv from 'dotenv'; // Load environment variables (e.g., for DB URI)
import geminiRoute  from './routes/geminiRoutes.js'
dotenv.config(); // This will load variables from a .env file

const app = express();
import './passport.js';
app.use(express.json())
// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/Ai-powered-expenses-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected to Ai-powered-expenses-tracker');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Middleware for sessions
app.use(
    session({
        secret: "ranger", // Your session secret key
        resave: false, // Prevents resaving session if unmodified
        saveUninitialized: false, // Prevents saving uninitialized sessions
        cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24-hour session
    })
);

app.use(passport.initialize());
app.use(passport.session()); // This is needed to support login sessions

app.use(
    cors({
        origin: "http://localhost:5173", // Frontend URL
        methods: "GET,POST,PUT,DELETE",
        credentials: true
    })
);

app.use("/auth", googleRoutes); // Google authentication routes
app.use("/api/users", userAuth); // User authentication and CRUD routes
app.use("/api/expenseRoute", expenseRoutes); // Expense-related routes
app.use("/api/category", categoryRoutes); // Expense-related routes
app.use("/api/report", geminiRoute); // Expense-related routes

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
