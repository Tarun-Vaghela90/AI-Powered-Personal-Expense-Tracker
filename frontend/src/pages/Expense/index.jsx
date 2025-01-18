import {FaHome}  from 'react-icons/fa'

export default function Expense() {
    return (
      <>
  {/* Expense Title Sticking to Top */}
  <div className="  w-full text-center    ">
    <h1 className="text-2xl font-bold">Expense</h1>
  </div>

  {/* Content Below the Title */}
  <div className="flex flex-col items-center justify-center mt-24">
    <div className="w-full p-4 border ring-4 ring-purple-600 flex items-center rounded-xl">
      <div className="rounded-full bg-purple-600 p-2 mr-4">
        <FaHome size={40} color="white" />
      </div>
      <div className="flex flex-col w-72">
        <h2 className="text-lg font-semibold">Expense</h2>
        <p className="text-sm text-gray-600">Traskjackskncnkck your expenses here.</p>
      </div>
    </div>
  </div>
</>

    

    );
  }
  