import express, { json } from 'express';
import userAuth from './routes/userAuth.js';
import expenseRoutes from './routes/expenseRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cors from 'cors';
import mongoose from 'mongoose'; // Import mongoose to connect to MongoDB
import dotenv from 'dotenv'; // Load environment variables (e.g., for DB URI)
import geminiRoute  from './routes/geminiRoutes.js'
import groupRoute from './routes/groupRoutes.js'
dotenv.config(); // This will load variables from a .env file

const app = express();
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

app.use(
    cors({
        origin: "http://localhost:5173", // Frontend URL
        methods: "GET,POST,PUT,DELETE",
        credentials: true
    })
);

app.use("/api/users", userAuth); // User authentication and CRUD routes
app.use("/api/expenseRoute", expenseRoutes); // Expense-related routes
app.use("/api/category", categoryRoutes); // Category-related routes
app.use("/api/report", geminiRoute); // report-related routes
app.use("/api/group", groupRoute); // Group-related routes

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
