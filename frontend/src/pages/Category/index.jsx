import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Budget() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ label: '', budget: '', expense: 0 });
  const [data, setData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const authToken = localStorage.getItem('authToken');

  // Fetch categories on component mount or after any changes
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/category/allcategories', {
        headers: { authToken: authToken },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const result = await response.json();
      if (Array.isArray(result.categories)) {
        setData(result.categories);
      } else {
        console.error('API did not return an array:', result);
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [authToken]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setEditingIndex(null); // Reset editing index
    setNewCategory({ label: '', budget: '', expense: 0 }); // Reset form fields
    setErrors({});
    setErrorMessage('');
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!newCategory.label) newErrors.label = 'Category name is required';
    if (!newCategory.budget) newErrors.budget = 'Budget is required';
    return newErrors;
  };

  // Handle form submit for add/update category
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      let response;
      if (editingIndex !== null) {
        const categoryId = data[editingIndex]._id;
        // PUT request to update category
        response = await fetch(`http://localhost:3001/api/category/category/${categoryId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            authToken: authToken,
          },
          body: JSON.stringify({
            name: newCategory.label,
            budget: newCategory.budget,
            expense: newCategory.expense, // Include expense in case it's relevant for update
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update category');
        }

        // Fetch updated categories after successful update
        await fetchCategories();
      } else {
        // POST request to create new category
        response = await fetch('http://localhost:3001/api/category/categorycreate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authToken: authToken,
          },
          body: JSON.stringify({
            name: newCategory.label,
            budget: newCategory.budget,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create category');
        }

        // Fetch updated categories after successful creation
        await fetchCategories();
      }

      toggleModal(); // Close modal after success
    } catch (error) {
      console.error('Error adding/updating category:', error);
      setErrorMessage(error.message);
    }
  };

  // Edit category
  const handleEditCategory = (index) => {
    setEditingIndex(index); // Set index of category being edited
    const categoryToEdit = data[index];
    setNewCategory({
      label: categoryToEdit.name, // Populate form with existing values
      budget: categoryToEdit.budget,
      expense: categoryToEdit.expense || 0,
    });
    setIsModalOpen(true); // Open modal
  };

  const handleDeleteCategory = async () => {
    if (editingIndex === null) return;
    const categoryId = data[editingIndex]._id;

    try {
      const response = await fetch(`http://localhost:3001/api/category/category/${categoryId}`, {
        method: 'DELETE',
        headers: { authToken: authToken },
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      // Fetch updated categories after successful deletion
      await fetchCategories();
      toggleModal();
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
        <button onClick={toggleModal} className="w-10 h-10 flex items-center justify-center rounded-md bg-blue-600">
          <FaPlus />
        </button>
      </div>

      <hr className="mb-3 mt-2" />

      <div className="grid grid-cols-4 gap-y-5 gap-x-6">
        {Array.isArray(data) && data.map((item, index) => {
          const budget = item.budget || 0;
          const expense = item.expense || 0;
          return (
            <div
              key={index}
              onClick={() => handleEditCategory(index)}
              className="w-64 h-32 p-4 rounded-lg shadow-lg bg-[#28282a] hover:shadow-2xl transition duration-300 ease-in-out flex items-center justify-between space-x-4 cursor-pointer"
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
                <div className="text-xs text-center flex flex-col space-y-1">
                  <span>Expense: {expense}</span>
                  <span>Budget: {budget || 'Not Set'}</span>
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
                  className="w-full border border-gray-300 p-2 rounded-md"
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
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
                {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
              </div>

              {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  {editingIndex !== null ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded-md"
                  onClick={toggleModal}
                >
                  Cancel
                </button>
                {editingIndex !== null && (
                  <button
                    type="button"
                    className="bg-red-600 text-white px-4 py-2 rounded-md"
                    onClick={handleDeleteCategory}
                  >
                    Delete
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
