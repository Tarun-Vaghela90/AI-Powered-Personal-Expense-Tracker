import { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Budget() {
  // State to manage modal visibility and form input values
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ label: '', budget: '', expense: 0 });
  const [data, setData] = useState([
    { label: 'Rent', budget: 1000, expense: 800 },
    { label: 'Groceries', budget: 300, expense: 150 },
    { label: 'Utilities', budget: 200, expense: 180 },
  ]);
  const [editingIndex, setEditingIndex] = useState(null); // Track editing category
  const [errors, setErrors] = useState({}); // Validation errors

  // Function to handle opening and closing the modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setEditingIndex(null); // Reset editing when modal is closed
  };

  // Function to handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };

  // Function to validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!newCategory.label) newErrors.label = 'Category name is required';
    if (!newCategory.budget) newErrors.budget = 'Budget is required';
    return newErrors;
  };

  // Function to handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    if (editingIndex !== null) {
      // Update existing category
      const updatedData = [...data];
      updatedData[editingIndex] = newCategory;
      setData(updatedData);
    } else {
      // Add new category
      setData((prev) => [
        ...prev,
        { label: newCategory.label, budget: parseFloat(newCategory.budget), expense: 0 },
      ]);
    }

    setNewCategory({ label: '', budget: '', expense: 0 }); // Reset the form
    toggleModal(); // Close the modal
    setEditingIndex(null); // Reset editing index
    setErrors({}); // Clear validation errors
  };

  // Function to handle editing a category
  const handleEditCategory = (index) => {
    setEditingIndex(index);
    setNewCategory(data[index]); // Pre-fill form with selected category data
    setIsModalOpen(true); // Open the modal for editing
  };

  // Function to handle deleting a category
  const handleDeleteCategory = (index) => {
    const updatedData = data.filter((_, i) => i !== index); // Remove the category
    setData(updatedData);
    toggleModal(); // Close the modal after deleting
  };

  // Function to calculate chart data
  const getChartData = (expense, budget) => {
    const remainingBudget = budget - expense;
    const data = {
      labels: ['Expense', 'Remaining'],
      datasets: [
        {
          data: budget ? [expense, remainingBudget] : [100, 0], // If no budget, show 100% expense
          backgroundColor: ['#ff4d4d', '#d3d3d3'], // Red for expense, grey for remaining
          borderWidth: 1,
        },
      ],
    };
    return data;
  };

  return (
    <>
      <div className="flex justify-end mt-5">
        <button onClick={toggleModal} className="w-10 h-10 flex items-center justify-center rounded-md bg-blue-600">
          <FaPlus />
        </button>
      </div>

      <hr className="mb-3 mt-2" />

      {/* Grid for displaying categories */}
      <div className="grid grid-cols-4 gap-y-5 gap-x-6">
        {data.map((item, index) => {
          const budget = item.budget || 0; // Get budget, default to 0 if not available
          const expense = item.expense || 0; // Get expense, default to 0 if not available
          return (
            <div
              key={index}
              onClick={() => handleEditCategory(index)} // Open the modal on card click
              className="w-64 h-32 p-4 rounded-lg shadow-lg bg-[#28282a] hover:shadow-2xl transition duration-300 ease-in-out flex items-center justify-between space-x-4 cursor-pointer"
            >
              {/* Chart on the Left */}
              <div className="w-20 h-20">
                <Doughnut
                  data={getChartData(expense, budget)}
                  options={{
                    cutout: '70%', // To make it a ring
                    plugins: {
                      tooltip: { enabled: false }, // Disable tooltips
                      legend: { display: false },  // Hide the legend
                    },
                  }}
                />
              </div>

              {/* Category Name and Budget on the Right */}
              <div className="text-white text-sm flex flex-col justify-center">
                <h2 className="font-semibold mb-2">{item.label}</h2>
                <div className="text-xs text-center flex flex-col space-y-1">
                  <span>Expense: {expense}</span>
                  <span>Budget: {budget || 'Not Set'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for adding, editing, or deleting category */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-semibold mb-4">{editingIndex !== null ? 'Edit Category' : 'Add New Category'}</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Category Name</label>
                <input
                  type="text"
                  name="label"
                  value={newCategory.label}
                  onChange={handleInputChange}
                  className="mt-1 p-2 block w-full border rounded-md"
                  required
                />
                {errors.label && <p className="text-red-500 text-sm">{errors.label}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">Budget</label>
                <input
                  type="number"
                  name="budget"
                  value={newCategory.budget}
                  onChange={handleInputChange}
                  className="mt-1 p-2 block w-full border rounded-md"
                  required
                />
                {errors.budget && <p className="text-red-500 text-sm">{errors.budget}</p>}
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={toggleModal} className="px-4 py-2 bg-gray-500 text-white rounded-md">Cancel</button>
                {editingIndex === null ? (
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Save</button>
                ) : (
                  <div className="flex justify-between w-full">
                    <button
                      onClick={() => handleDeleteCategory(editingIndex)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md"
                    >
                      Delete
                    </button>
                    <button
                      onClick={toggleModal}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
