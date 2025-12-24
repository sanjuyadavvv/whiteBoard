import React from 'react'
import { useSelector } from 'react-redux';


const RoomId = ({showRoom,setShowRoom}) => {
    const currentRoom=useSelector((state)=>state.user.roomId)
    console.log(currentRoom)
    
  return (
    <div className="relative">
     
      {showRoom && (
        <>
          
          <div
            onClick={() =>setShowRoom(false)}
            // className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

  
     <div className="fixed top-[400px] left-1/2 w-[300px] h-[200px] 
                          -translate-x-1/2 -translate-y-1/2 
                          bg-[white] rounded-lg shadow-[0_0_30px_5px_rgba(0,0,0,0.2)] z-50 p-4 flex flex-col"> 
                  
           
            <div className="flex justify-center items-center border-b pb-2">
              <h3 className="text-lg font-semibold">Room Id </h3>
              <button
                onClick={() => setShowRoom(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✖
              </button>
            </div>
              <p className='text-center'>
                Room id is  <strong>{currentRoom}</strong>
              </p>
              <p className='text-center'>Copy this id invite your friends</p>
          </div>
        </>
      )}
    </div>


 

  );
};


export default RoomId

