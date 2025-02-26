import React, { useState } from 'react';

export default function Expense() {
  const [showModal, setShowModal] = useState(false);
  const [expense, setExpense] = useState({ id: '', name: '', note: '', type: '', amount: '' });
  const [expenses, setExpenses] = useState([
    { id: 1, name: 'Car', note: 'Others', type: 'Expense', amount: '500,000' },
    { id: 2, name: 'Groceries', note: 'Food', type: 'Expense', amount: '5,000' },
  ]); // Sample data for expenses
  const [editingIndex, setEditingIndex] = useState(null); // To track editing
  const [errors, setErrors] = useState({}); // Validation errors

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!expense.name) newErrors.name = 'Name is required';
    if (!expense.note) newErrors.note = 'Note is required';
    if (!expense.type) newErrors.type = 'Type is required';
    if (!expense.amount) newErrors.amount = 'Amount is required';
    return newErrors;
  };

  const handleSubmit = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    if (editingIndex !== null) {
      const updatedExpenses = [...expenses];
      updatedExpenses[editingIndex] = expense;
      setExpenses(updatedExpenses);
    } else {
      setExpenses((prev) => [...prev, { ...expense, id: expenses.length + 1 }]);
    }
    setShowModal(false); // Close modal after submission
    setExpense({ id: '', name: '', note: '', type: '', amount: '' }); // Reset the form
    setEditingIndex(null); // Reset editing index
    setErrors({}); // Clear validation errors
  };

  const handleNewExpense = () => {
    setExpense({ id: '', name: '', note: '', type: '', amount: '' }); // Reset form fields for new expense
    setEditingIndex(null); // Reset editing index
    setShowModal(true); // Open modal
    setErrors({}); // Clear validation errors
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setExpense(expenses[index]);
    setShowModal(true);
  };

  const handleDelete = (index) => {
    const filteredExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(filteredExpenses);
  };

  return (
    <div className="w-full p-8 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <div>
          <input type="checkbox" id="selectAll" className="mr-2" />
          <label htmlFor="selectAll" className="text-xl font-semibold">Select All</label>
        </div>
        <button onClick={handleNewExpense} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          New Expense
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto font-sans w-full text-center">
          <thead className="text-2xl bg-blue-600 text-white">
            <tr>
              <th className="p-4">
                <input type="checkbox" />
              </th>
              <th className="p-4">Id</th>
              <th className="p-4">Name</th>
              <th className="p-4">Note</th>
              <th className="p-4">Type</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Edit</th>
              <th className="p-4">Delete</th>
            </tr>
          </thead>
          <tbody className="text-xl">
            {expenses.map((exp, index) => (
              <tr key={exp.id} className="hover:bg-gray-700">
                <td className="p-4">
                  <input type="checkbox" />
                </td>
                <td className="p-4">{exp.id}</td>
                <td className="p-4">{exp.name}</td>
                <td className="p-4">{exp.note}</td>
                <td className="p-4">{exp.type}</td>
                <td className="p-4">{exp.amount}</td>
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
                className="w-full p-2 rounded-lg bg-gray-600 text-white"
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
                <option value="Credit">Credit</option>
                <option value="Debit">Debit</option>
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
            </div>
            <div className="flex justify-end mt-4 space-x-4">
              <button onClick={() => setShowModal(false)} className="bg-red-500 px-4 py-2 rounded-lg text-white">
                Cancel
              </button>
              <button onClick={handleSubmit} className="bg-green-500 px-4 py-2 rounded-lg text-white">
                {editingIndex !== null ? 'Update Expense' : 'Add Expense'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
