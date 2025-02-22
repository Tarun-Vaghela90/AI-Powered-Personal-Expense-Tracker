import Transaction from '../model/Transaction.js';

// Get all transactions
const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find(); // Fetch all transactions
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Create a new transaction
const createTransaction = async (req, res) => {
    const { budgetId, description, amount, type } = req.body;

    try {
        const newTransaction = new Transaction({
            budgetId,
            description,
            amount,
            type
        });

        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);
    } catch (err) {
        res.status(400).json({ error: 'Failed to create transaction' });
    }
};

// Update a transaction
const updateTransaction = async (req, res) => {
    const { id } = req.params;
    const { description, amount, type } = req.body;

    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            id,
            { description, amount, type },
            { new: true }  // Return the updated document
        );

        if (!updatedTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json(updatedTransaction);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update transaction' });
    }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTransaction = await Transaction.findByIdAndDelete(id);

        if (!deletedTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json({ message: 'Transaction deleted' });
    } catch (err) {
        res.status(400).json({ error: 'Failed to delete transaction' });
    }
};

export { getTransactions, createTransaction, updateTransaction, deleteTransaction };
