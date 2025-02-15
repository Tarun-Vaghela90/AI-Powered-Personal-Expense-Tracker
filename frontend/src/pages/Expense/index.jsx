import {FaHome,FaPlus}  from 'react-icons/fa'

export default function Expense() {
    return (
      <>
  {/* Expense Title Sticking to Top */}
  <div className="  w-full text-center    ">
    <h1 className="text-2xl font-bold">Expense</h1>
  </div>
<div className="flex justify-end mt-5">
  <button className="w-10 h-10 flex items-center justify-center rounded-md bg-blue-600">
    <FaPlus />
  </button>
</div>
  {/* Content Below the Title */}
  <div className="flex flex-col items-center  justify-center mt-24">
    <div className="w-68 p-4 border ring-4 bg-white ring-purple-600 flex items-center justify-evenly rounded-xl">
      <div className="rounded-full  bg-purple-600 p-2 mr-4">
        <FaHome size={40} color="white" />
      </div>
      <div className="flex flex-col w-42 pl-7 pr-7  " >
        <h2 className="text-lg font-semibold">Expense Name</h2>
        <h2 className='text-sm'>Date: 23/01/2025</h2>
        <p className="text-sm text-gray-600">Comment On your expenses here.</p>
      </div>
      <div className="flex flex-col w-42 pl-7 pr-7 mb-4">
        <h2 className="text-lg font-semibold">Amount</h2>
        <h2 className='text-md'>10000  INR</h2>
      </div>

    </div>
  </div>
</>

    

    );
  }
  