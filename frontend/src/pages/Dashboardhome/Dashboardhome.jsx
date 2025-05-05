import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { useNavigate } from 'react-router-dom';

export default function Dashboardhome() {
  const [userData, setUserData] = useState(null);
  const [totalSum, setTotalSum] = useState({ totalCredit: 0, totalDebit: 0 });
  const [expenseData, setExpenseData] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to fetch user data and expense data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');

        // Fetch user data
        const userResponse = await fetch('http://localhost:3001/api/users/getuser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authToken': authToken,
          },
        });

        if (!userResponse.ok) throw new Error('Failed to fetch user data');
        const userData = await userResponse.json();
        console.log(userData)
        setUserData(userData);

        // Fetch total credit and debit sum
        const totalResponse = await fetch(
          `http://localhost:3001/api/expenseRoute/expenseTotal/${userData._id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'authToken': authToken,
            },
          }
        );

        if (!totalResponse.ok) throw new Error('Failed to fetch total sum');
        const totalData = await totalResponse.json();
        console.log(totalData)
        setTotalSum(totalData);

        // Fetch expense data
        const expenseResponse = await fetch('http://localhost:3001/api/expenseRoute/expensesfetch', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authToken': authToken,
          },
        });

        if (!expenseResponse.ok) throw new Error('Failed to fetch expense data');
        const expenseData = await expenseResponse.json();
        setExpenseData(expenseData.expenses);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  if (!userData || expenseData.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Your Dashboard!</h1>
        <p className="text-lg text-gray-600 mb-6">
          It looks like you haven't added any expenses yet. Start tracking your expenses to see your dashboard insights.
        </p>
        <button
          onClick={() => navigate("/dashboard/expense")} // Absolute path to avoid appending
          className="px-6 py-3 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 transition duration-300"
        >
          Add Your First Expense
        </button>
      </div>
    );
  }
  

  // Function to group expenses by month
  const groupExpensesByMonth = (expenses) => {
    const grouped = {};

    expenses.forEach((expense) => {
      const date = new Date(expense.createdAt);
      const month = date.getMonth();
      const year = date.getFullYear();
      const monthYear = `${year}-${month + 1}`;

      if (!grouped[monthYear]) {
        grouped[monthYear] = 0;
      }
      grouped[monthYear] += expense.amount;
    });

    return grouped;
  };

  const groupedExpenses = groupExpensesByMonth(expenseData);
  const expenseLabels = Object.keys(groupedExpenses).map((monthYear) => {
    const [year, month] = monthYear.split('-');
    return `${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`;
  });

  const expenseValues = Object.values(groupedExpenses);

  return (
    <div>
      <div className="flex space-x-4 justify-center items-center">
        {/* Income Card */}
        <div className="w-64 h-32 border border-gray-300 rounded-lg shadow-lg flex-1 bg-[#28282a] hover:shadow-2xl transition duration-300 ease-in-out">
          <h2 className="text-lg font-semibold p-2 text-center text-white">Income</h2>
          <hr className="border-gray-300" />
          <h1 className="text-3xl font-bold p-3 text-center text-green-600">
            {totalSum.totalCredit}
          </h1>
        </div>

        {/* Expense Card */}
        <div className="w-64 h-32 border border-gray-300 rounded-lg shadow-lg flex-1 bg-[#28282a] hover:shadow-2xl transition duration-300 ease-in-out">
          <h2 className="text-lg font-semibold p-2 text-center text-white">Expense</h2>
          <hr className="border-gray-300" />
          <h1 className="text-3xl font-bold p-3 text-center text-red-600">
            {totalSum.totalDebit}
          </h1>
        </div>

        {/* Balance Card */}
        <div className="w-64 h-32 border rounded-lg shadow-lg flex-1 bg-[#28282a] hover:shadow-2xl transition duration-300 ease-in-out">
          <h2 className="text-lg font-semibold p-2 text-center text-white">Balance</h2>
          <hr className="border-gray-300" />
          <h1 className="text-3xl font-bold p-3 text-center text-blue-600">
            {totalSum.totalCredit - totalSum.totalDebit}
          </h1>
        </div>
      </div>

      {/* Chart and Category sections */}
      <div className="flex space-x-4 mt-5 justify-center items-center">
        <div className="min-w-48 h-3/6 p-2 border-white rounded-lg shadow-lg flex-1 bg-[rgb(27,27,27)] hover:shadow-2xl transition duration-300 ease-in-out chart">
          <h2 className="text-lg font-semibold p-2 text-center text-white">Expense by Month</h2>
          <hr className="border-gray-300" />
          
          {/* Description/Suggestion text for the chart */}
          <p className="text-white p-2 text-center">
            This chart shows the monthly trend of your expenses. The X-axis represents the months, and the Y-axis shows the total expenses for each month. 
            Use this chart to track your spending over time and identify patterns in your expenditures.
          </p>

          <Line
            data={{
              labels: expenseLabels,
              datasets: [
                {
                  label: 'Expenses',
                  data: expenseValues,
                  backgroundColor: '#ff4c4c',
                  borderColor: '#ff1a1a',
                  fill: false,
                },
              ],
            }}
            options={{
              responsive: true,
              scales: {
                x: {
                  ticks: {
                    autoSkip: true,
                    maxRotation: 45,
                    minRotation: 30,
                  },
                  title: {
                    display: true,
                    text: 'Month',
                  },
                },
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

{/* <div className="min-w-72 h-3/6 p-2 border flex-col border-gray-300 rounded-lg shadow-lg bg-[rgb(27,27,27)] hover:shadow-2xl transition duration-300 ease-in-out">
  <h2 className="text-lg font-semibold p-2 text-center text-white">Category</h2>
  <hr className="border-gray-300" />
  <div className="min-w-60 mt-2 h-32 border border-gray-300 rounded-lg shadow-lg flex-1 bg-[#28282a] hover:shadow-2xl transition duration-300 ease-in-out">
    <h2 className="text-lg font-semibold p-2 text-center text-white">Patrol</h2>
    <hr className="border-gray-300" />
    <h1 className="text-3xl font-bold p-3 text-center text-white">$500</h1>
  </div>
  <div className="min-w-60 mt-2 h-32 border border-gray-300 rounded-lg shadow-lg flex-1 bg-[#28282a] hover:shadow-2xl transition duration-300 ease-in-out">
    <h2 className="text-lg font-semibold p-2 text-center text-white">Fees</h2>
    <hr className="border-gray-300" />
    <h1 className="text-3xl font-bold p-3 text-center text-white">$500</h1>
  </div>
</div> */}