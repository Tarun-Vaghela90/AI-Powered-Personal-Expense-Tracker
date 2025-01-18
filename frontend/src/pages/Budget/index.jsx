
import revenueData  from './revenueData.json'
import { FaPlus } from "react-icons/fa6";
export default function Budget() {



    return (
      <>
   <div className="flex justify-end mt-5">
  <button className="w-10 h-10 flex items-center justify-center rounded-md bg-blue-600">
    <FaPlus />
  </button>
</div>


      <hr  className='mb-3 mt-2 '/>
      <div  className="grid grid-cols-4   gap-y-5  gap-x-6">
      {  
      revenueData.map((data,index)=>{
         return(
          
          <div key={index} className=" w-62 h-32 border  border-gray-300 ring-2 ring-blue-500 rounded-lg shadow-lg flex-1 bg-white hover:shadow-2xl transition duration-300 ease-in-out">
          <h2 className="text-lg font-semibold p-2 text-center text-gray-800">{data.label}</h2>
          <hr className="border-gray-300"/>
          <h1 className="text-3xl font-bold p-3 text-center text-red-600">{data.cost}</h1>
        </div>
         )

      })
   
}
      </div>
      </>
    );
  }
  