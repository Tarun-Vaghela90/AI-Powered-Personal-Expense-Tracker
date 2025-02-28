import express from 'express';
import { fetchuser } from '../middleware/authMiddleware.js';
import Expense from '../model/ExpenseModel.js'; // Import the Expense model
const router = express.Router();
import {
  GoogleGenerativeAI,
}  from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

// Protect these routes with the fetchuser middleware
router.post('/geminireport', fetchuser, async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: 'text/plain',
  };

  try {
    // Fetch the user's expenses from the database
    const userId = req.user.id; // `req.user` is populated by the fetchuser middleware
    const expenses = await Expense.find({ user: userId }).populate('category', 'name'); // Populate the category name

    if (!expenses || expenses.length === 0) {
      return res.status(404).json({ msg: 'No expenses found for this user' });
    }

    // Format expenses data as text for the model
    const expenseText = expenses
      .map(
        (expense) =>
          `Name: ${expense.name}, Type: ${expense.type}, Amount: ${expense.amount}, Category: ${expense.category.name}, Note: ${expense.note || 'No note'}`
      )
      .join('\n');

    // Start the chat session and provide the initial financial analysis prompt
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: 'user',
          parts: [
            {
              text:
                'You are a master of finance, an expert who will provide suggestions, analysis, show hidden patterns, recommend budgets, categorization, and expense predictions,YOU WILL NOT ASK ANY QUESTION YOU JUST PROVIDE INFO.Your responsed should be in react jsx html tags only with inline css included to style. Here are the expense details:\n' +
                expenseText,
            },
          ],
        },
        {
          role: 'model',
          parts: [
            {
              text:
                'Understood. Provide me with the financial data and I will immediately provide analysis, suggestions, pattern identification, budget recommendations, categorization, and expense predictions.\n',
            },
          ],
        },
      ],
    });

    // Send the formatted expenses data for analysis
    const result = await chatSession.sendMessage(
      'Please analyze and provide suggestions for the given expense data.'
    );

    // Send the model's response back to the client
    res.json({ analysis: result.response.text() });
  } catch (error) {
    console.error('Error communicating with Gemini API or fetching data:', error);
    res.status(500).json({ msg: 'Error while processing the transaction data' });
  }
});

export default router;
