import React, { useState, useEffect } from 'react';

export default function Expense() {
  const [showModal, setShowModal] = useState(false);
  const [expense, setExpense] = useState({ id: '', name: '', note: '', type: '', amount: '', category: '' });
  const [expenses, setExpenses] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch expenses when the component mounts
  const fetchExpenses = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('No auth token found');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/expenseRoute/expensesfetch', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authToken': token,
        },
      });
      const data = await response.json();

      if (data.success) {
        setExpenses(data.expenses); // Update state with fetched expenses
      } else {
        console.log('Failed to fetch expenses');
      }
    } catch (error) {
      console.log('Error fetching expenses:', error);
    }
  };
  useEffect(() => {
    

    fetchExpenses();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  // Fetch categories for the dropdown
  const fetchCategories = async () => {
    const authToken = localStorage.getItem('authToken');
    try {
      const response = await fetch('http://localhost:3001/api/category/allcategories', {
        headers: { authToken: authToken },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const result = await response.json();
      if (Array.isArray(result.categories)) {
        setCategories(result.categories);
      } else {
        console.error('API did not return an array:', result);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage(error.message);
    }
  };

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  // Handle input change for both form inputs and select fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!expense.name) newErrors.name = 'Name is required';
    if (!expense.note) newErrors.note = 'Note is required';
    if (!expense.type) newErrors.type = 'Type is required';
    if (!expense.amount) newErrors.amount = 'Amount is required';
    if (!expense.category) newErrors.category = 'Category is required';
    return newErrors;
  };

  // Handle form submission
  // Handle form submission
  const handleSubmit = async () => {
    // Validate the form before proceeding
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
  
    // Create a new expense object
    const newExpense = {
      ...expense,
      category: expense.category, // Ensure the category is passed correctly
    };
  
    try {
      const token = localStorage.getItem('authToken');
      let response, data;
  
      if (editingIndex !== null) {
        // If editing, update the expense
        if (!expense._id) {
          setErrorMessage('Expense ID is missing');
          return;
        }
  
        response = await fetch(`http://localhost:3001/api/expenseRoute/expense/${expense._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'authToken': token,
          },
          body: JSON.stringify(newExpense),
        });
  
        data = await response.json();
        if (data.success) {
          const updatedExpenses = [...expenses];
          updatedExpenses[editingIndex] = data.expense; // Update the edited expense in state
          setExpenses(updatedExpenses);
          fetchExpenses();
        } else {
          setErrorMessage('Failed to update expense');
        }
      } else {
        // If creating a new expense
        response = await fetch('http://localhost:3001/api/expenseRoute/expenseCreate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authToken': token,
          },
          body: JSON.stringify(newExpense),
        });
  
        data = await response.json();
        if (data.success) {
          setExpenses((prev) => [...prev, data.expense]); // Add the new expense to the state
          fetchExpenses();
        } else {
          setErrorMessage('Failed to create expense');
        }
      }
  
      setShowModal(false); // Close the modal
      setExpense({ id: '', name: '', note: '', type: '', amount: '', category: '' });
      setEditingIndex(null);
      setErrors({});
  
    } catch (error) {
      console.error('Error creating/updating expense:', error);
      setErrorMessage('An error occurred while creating/updating the expense');
    }
  };
  


  // Handle modal for new expense
  const handleNewExpense = () => {
    setExpense({ id: '', name: '', note: '', type: '', amount: '', category: '' });
    setEditingIndex(null);
    setShowModal(true);
    setErrors({});
  };

  // Handle editing an expense
  const handleEdit = (index) => {
    setEditingIndex(index);
    setExpense(expenses[index]);
    setShowModal(true);
  };

  // Handle deleting an expense
  // Handle deleting an expense
const handleDelete = async (index) => {
  const expenseId = expenses[index]._id; // Get the ID of the expense to be deleted
  const token = localStorage.getItem('authToken');

  try {
    // Send DELETE request to the server to remove the expense
    const response = await fetch(`http://localhost:3001/api/expenseRoute/expense/${expenseId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'authToken': token,
      },
    });

    const data = await response.json();
    if (data.success) {
      // If delete is successful, remove the expense from the state
      const filteredExpenses = expenses.filter((_, i) => i !== index);
      setExpenses(filteredExpenses);
      fetchExpenses();
    } else {
      setErrorMessage('Failed to delete expense');
    }
  } catch (error) {
    console.error('Error deleting expense:', error);
    setErrorMessage('An error occurred while deleting the expense');
  }
};


  return (
    <div className="w-full p-8 text-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <div>
          {/* <input type="checkbox" id="selectAll" className="mr-2" /> */}
          {/* <label htmlFor="selectAll" className="text-xl font-semibold">Select All</label> */}
        </div>
        <button onClick={handleNewExpense} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          New Expense
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto font-sans w-full text-center">
          <thead className="text-xl bg-blue-600 text-white">
            <tr>
             
              <th className="p-4 ">Id</th>
              <th className="p-4">Name</th>
              <th className="p-4">Note</th>
              <th className="p-4">Type</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Category</th>
              <th className="p-4">Edit</th>
              <th className="p-4">Delete</th>
            </tr>
          </thead>
          <tbody className="text-large">
            {expenses.map((exp, index) => (
              <tr key={exp._id} className="hover:bg-gray-700">
                
                <td className="p-4">{exp._id}</td>
                <td className="p-4">{exp.name}</td>
                <td className="p-4">{exp.note}</td>
                <td className="p-4">{exp.type}</td>
                <td className="p-4">{exp.amount}</td>
                <td className="p-4">{exp.category.name}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleEdit(index)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-gray-700 p-8 rounded-lg w-96">
            <h2 className="text-2xl mb-4">{editingIndex !== null ? 'Edit Expense' : 'Add New Expense'}</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="id"
                placeholder="Id"
                value={expense.id}
                onChange={handleInputChange}
                className="w-full hidden p-2 rounded-lg bg-gray-600 text-white"
                disabled
              />
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={expense.name}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg bg-gray-600 text-white"
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}

              <input
                type="text"
                name="note"
                placeholder="Note"
                value={expense.note}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg bg-gray-600 text-white"
              />
              {errors.note && <p className="text-red-500">{errors.note}</p>}

              <select
                name="type"
                value={expense.type}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg bg-gray-600 text-white"
              >
                <option value="">Select Type</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
              {errors.type && <p className="text-red-500">{errors.type}</p>}

              <input
                type="text"
                name="amount"
                placeholder="Amount"
                value={expense.amount}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg bg-gray-600 text-white"
              />
              {errors.amount && <p className="text-red-500">{errors.amount}</p>}

              <select
                name="category"
                value={expense.category}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg bg-gray-600 text-white"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500">{errors.category}</p>}
            </div>
            <div className="flex justify-end mt-4 space-x-4">
              <button onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                Cancel
              </button>
              <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                {editingIndex !== null ? 'Update Expense' : 'Add Expense'}
              </button>
            </div>
          </div>
        </div>
      )}
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
    </div>
  );
}
