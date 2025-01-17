
import {Chart as ChartJS} from 'chart.js/auto'
import {Line}  from 'react-chartjs-2'
import revenueData  from './revenueData.json'
export default function DashboardHome() {
  
  
  return (
    <div>
    <div className="flex space-x-4 justify-center items-center ">
  {/* Income Card */}
  <div className="w-64 h-32 border border-gray-300 rounded-lg shadow-lg flex-1 bg-white hover:shadow-2xl transition duration-300 ease-in-out">
    <h2 className="text-lg font-semibold p-2 text-center text-gray-800">Income</h2>
    <hr className="border-gray-300"/>
    <h1 className="text-3xl font-bold p-3 text-center text-green-600">$1,000</h1>
  </div>

  {/* Expense Card */}
  <div className="w-64 h-32 border border-gray-300 rounded-lg shadow-lg flex-1 bg-white hover:shadow-2xl transition duration-300 ease-in-out">
    <h2 className="text-lg font-semibold p-2 text-center text-gray-800">Expense</h2>
    <hr className="border-gray-300"/>
    <h1 className="text-3xl font-bold p-3 text-center text-red-600">$500</h1>
  </div>

  {/* Balance Card */}
  <div className="w-64 h-32 border border-gray-300 rounded-lg shadow-lg flex-1 bg-white hover:shadow-2xl transition duration-300 ease-in-out">
    <h2 className="text-lg font-semibold p-2 text-center text-gray-800">Balance</h2>
    <hr className="border-gray-300"/>
    <h1 className="text-3xl font-bold p-3 text-center text-blue-600">$500</h1>
  </div>

</div>
<div className="flex space-x-4 mt-5 justify-center items-center">
<div className="min-w-48 h-3/6 p-2 border border-gray-300 rounded-lg shadow-lg flex-1 bg-white hover:shadow-2xl transition duration-300 ease-in-out">
    <h2 className="text-lg font-semibold p-2 text-center text-gray-800">Chart</h2>
    <hr className="border-gray-300"/>
  <Line data={{
    labels: revenueData.map((data)=> data.label),
    datasets:[
      {label:"revenue",
        data: revenueData.map((data)=>data.revenue),
        backgroundColor:"#064ff0",
        borderColor:"#064ff0"
      
      }
    ]
    }}
    />
  </div>
<div className="min-w-72 h-3/6 p-2 border flex-col border-gray-300 rounded-lg shadow-lg  bg-white hover:shadow-2xl transition duration-300 ease-in-out">
    <h2 className="text-lg  font-semibold p-2 text-center text-gray-800">Category</h2>
    <hr className="border-gray-300"/>
<div className="min-w-60 mt-2  h-32 border border-gray-300 rounded-lg shadow-lg flex-1 bg-white hover:shadow-2xl transition duration-300 ease-in-out">
    <h2 className="text-lg font-semibold p-2 text-center text-gray-800">Patrol</h2>
    <hr className="border-gray-300"/>
    <h1 className="text-3xl font-bold p-3 text-center text-blue-600">$500</h1>
  </div>
  <div className="min-w-60 mt-2 h-32 border border-gray-300 rounded-lg shadow-lg flex-1 bg-white hover:shadow-2xl transition duration-300 ease-in-out">
    <h2 className="text-lg font-semibold p-2 text-center text-gray-800">Fees</h2>
    <hr className="border-gray-300"/>
    <h1 className="text-3xl font-bold p-3 text-center text-blue-600">$500</h1>
  </div>
</div>

</div>
</div>
  );
}

