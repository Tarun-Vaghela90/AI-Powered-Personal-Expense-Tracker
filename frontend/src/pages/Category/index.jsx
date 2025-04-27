import { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Budget() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ label: '', budget: '' });
  const [data, setData] = useState([]);
  const [totalExpensesByCategory, setTotalExpensesByCategory] = useState({}); // Changed state name
  const [editingIndex, setEditingIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const authToken = localStorage.getItem('authToken');

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/category/allcategories', {
        headers: { authToken: authToken },
      });

      if (!response.ok) throw new Error('Failed to fetch categories');

      const result = await response.json();
      if (Array.isArray(result.categories)) {
        setData(result.categories);
      } else {
        console.error('API did not return an array:', result);
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setErrorMessage(error.message);
    }
  };

  // Fetch total debit expenses grouped by category
  const fetchTotalExpensesByCategoryData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/expenseRoute/personal/category', {
        headers: { authToken: authToken },
      });

      if (!response.ok) throw new Error('Failed to fetch total expenses by category');

      const result = await response.json();
      if (result.success && Array.isArray(result.expensesByCategory)) {
        const mappedExpenses = {};
        result.expensesByCategory.forEach((item) => {
          mappedExpenses[item.category] = item.totalDebit; // Use category name as key
        });
        setTotalExpensesByCategory(mappedExpenses);
      } else {
        console.error('API did not return the expected total expenses by category:', result);
        setTotalExpensesByCategory({});
      }
    } catch (error) {
      console.error('Error fetching total expenses by category:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTotalExpensesByCategoryData(); // Fetch total expenses on component mount and when categories change
  }, [authToken]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setEditingIndex(null);
    setNewCategory({ label: '', budget: '' });
    setErrors({});
    setErrorMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update the newCategory state
    setNewCategory((prev) => ({ ...prev, [name]: value }));

    // Validate inputs dynamically
    const newErrors = { ...errors };
    if (name === 'label') {
      if (!value.trim()) {
        newErrors.label = 'Category name is required';
      } else if (value.length < 3) {
        newErrors.label = 'Category name must be at least 3 characters long';
      } else {
        delete newErrors.label;
      }
    }

    if (name === 'budget') {
      if (!value.trim()) {
        newErrors.budget = 'Budget is required';
      } else if (isNaN(value) || Number(value) <= 0) {
        newErrors.budget = 'Budget must be a positive number';
      } else {
        delete newErrors.budget;
      }
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newCategory.label) newErrors.label = 'Category name is required';
    if (!newCategory.budget) newErrors.budget = 'Budget is required';
    return newErrors;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      let response;
      const payload = {
        name: newCategory.label,
        budget: newCategory.budget,
      };

      if (editingIndex !== null) {
        const categoryId = data[editingIndex]._id;
        response = await fetch(`http://localhost:3001/api/category/category/${categoryId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            authToken: authToken,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Failed to update category');
      } else {
        response = await fetch('http://localhost:3001/api/category/categorycreate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authToken: authToken,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Failed to create category');
      }

      await fetchCategories();
      fetchTotalExpensesByCategoryData(); // Re-fetch total expenses after updating categories
      toggleModal();
    } catch (error) {
      console.error('Error adding/updating category:', error);
      setErrorMessage(error.message);
    }
  };

  const handleEditCategory = (index) => {
    setEditingIndex(index);
    const categoryToEdit = data[index];
    setNewCategory({
      label: categoryToEdit.name,
      budget: categoryToEdit.budget,
    });
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (editingIndex === null) return;
    const confirmDelete = await new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50';

      modal.innerHTML = `
        <div class="bg-gray-700 p-8 rounded-lg w-96 text-white">
          <h2 class="text-2xl mb-4">Confirm Delete</h2>
          <p class="mb-4">Are you sure you want to delete this category?</p>
          <div class="flex justify-end space-x-4">
            <button id="cancelButton" class="bg-gray-500 text-white px-4 py-2 rounded-lg">Cancel</button>
            <button id="confirmButton" class="bg-red-500 text-white px-4 py-2 rounded-lg">Delete</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const cleanup = () => {
        document.body.removeChild(modal);
      };

      modal.querySelector('#cancelButton').addEventListener('click', () => {
        resolve(false);
        cleanup();
      });

      modal.querySelector('#confirmButton').addEventListener('click', () => {
        resolve(true);
        cleanup();
      });
    });
    if (!confirmDelete) {
      return; // Exit the function if the user cancels
    }
    const categoryId = data[editingIndex]._id;

    try {
      const response = await fetch(`http://localhost:3001/api/category/category/${categoryId}`, {
        method: 'DELETE',
        headers: { authToken: authToken },
      });

      if (!response.ok) throw new Error('Failed to delete category');

      await fetchCategories();
      fetchTotalExpensesByCategoryData(); // Re-fetch total expenses after deleting a category
      toggleModal();
      setEditingIndex(null); // Reset editing index after deletion
    } catch (error) {
      console.error('Error deleting category:', error);
      setErrorMessage(error.message);
    }
  };

  const getChartData = (expense, budget) => {
    const remainingBudget = budget - expense;
    return {
      labels: ['Expense', 'Remaining'],
      datasets: [
        {
          data: budget ? [expense, remainingBudget] : [100, 0],
          backgroundColor: ['#ff4d4d', '#d3d3d3'],
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <>
      <div className="flex justify-end mt-5">
        <button onClick={toggleModal} className="w-10 h-10 flex items-center justify-center rounded-md bg-blue-600 text-white">
          <FaPlus />
        </button>
      </div>

      <hr className="mb-3 mt-2" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.isArray(data) && data.map((item, index) => {
          const budget = item.budget || 0;
          const expense = totalExpensesByCategory[item.name] || 0; // Use category name here
          return (
            <div
              key={item._id}
              onClick={() => handleEditCategory(index)}
              className="p-4 rounded-lg shadow-lg bg-[#28282a] hover:shadow-2xl transition duration-300 ease-in-out flex items-center justify-between space-x-4 cursor-pointer"
            >
              <div className="w-20 h-20">
                <Doughnut
                  data={getChartData(expense, budget)}
                  options={{
                    cutout: '70%',
                    plugins: {
                      tooltip: { enabled: false },
                      legend: { display: false },
                    },
                  }}
                />
              </div>

              <div className="text-white text-sm flex flex-col justify-center">
                <h2 className="font-semibold mb-2">{item.name}</h2>
                <div className="text-xs flex flex-col space-y-1">
                  <span>Expense: ₹{expense}</span>
                  <span>Budget: ₹{budget || 'Not Set'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-semibold mb-4">{editingIndex !== null ? 'Edit Category' : 'Add New Category'}</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category Name</label>
                <input
                  type="text"
                  name="label"
                  value={newCategory.label}
                  onChange={handleInputChange}
                  className={`w-full border ${errors.label ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
                />
                {errors.label && <p className="text-red-500 text-sm mt-1">{errors.label}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Budget</label>
                <input
                  type="number"
                  name="budget"
                  value={newCategory.budget}
                  onChange={handleInputChange}
                  className={`w-full border ${errors.budget ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
                />
                {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
              </div>

              {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

              <div className="flex justify-end space-x-4 mt-4">
                <button type="button" onClick={toggleModal} className="px-4 py-2 bg-gray-500 text-white rounded-md">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                  Save
                </button>
                {editingIndex !== null && (
                  <button
                    type="button"
                    onClick={handleDeleteCategory}
                    className="px-4 py-2 bg-red-600 text-white rounded-md"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}