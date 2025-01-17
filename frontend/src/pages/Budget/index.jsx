
import revenueData  from './revenueData.json'

export default function Budget() {



    return (
      <>
      <span className='w-16 h-12 p-3   justify-end rounded-md bg-blue-600'>+</span>
      <hr  className='mb-2 mt-5'/>
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
  