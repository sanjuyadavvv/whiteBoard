// Navbar.jsx
import React from "react";
import { useState } from "react";
import RoomId from "./RoomId";
import GetALLUser from "./GetALLUser";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import ChatPanel from "./ChatPanel.jsx";


import socket from "./socket.jsx";

const Navbar = ({
  tool,
  setTool,
  color,
  setColor,
  lineWidth,
  setLineWidth,
  clearCanvas,
}) => {
  const tools = ["pen", "eraser", "line", "rect", "square", "circle"];

  const currentroomId = useSelector((state) => state.user.roomId);
  const currentUser = useSelector((state) => state.user.userDetails);
  const currentUserName = currentUser.fullName;

  const [showUsers, setShowUsers] = useState(false);

  const [showRoom, setShowRoom] = useState(false);



const[isChatOpen,setIsChatOpen]=useState(false)




  


  const handleUsers = () => {
    setShowUsers(true);
  };

  const showRoomId = () => {
    setShowRoom(true);
  };





  useEffect(() => {
    if (!socket) return;
    socket.on("receive-message", () => {
    
    });

    return () => socket.off("receive-message");
  }, [socket]);















  return (
    <div className="fixed top-0 left-2 w-full bg-white/90 backdrop-blur-md shadow-md flex items-center p-5 z-50 space-x-4">
      {/* Tool buttons */}

      <div className="flex flex-wrap gap-2 p-2 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
        {tools.map((t) => (
          <button
            key={t}
            onClick={() => setTool(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border 
        ${
          tool === t
            ? "bg-blue-100 text-black border-blue-100 shadow-sm scale-105"
            : "bg-white hover:bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-400"
        }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Color picker */}
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-10 h-10 border border-gray-300 rounded-md cursor-pointer"
      />

      {/* Line width */}
      <input
        type="range"
        min="1"
        max="20"
        value={lineWidth}
        onChange={(e) => setLineWidth(Number(e.target.value))}
        className="w-28 accent-red-500"
      />

      {/* App title */}
      <div className="flex-1 text-center">
        <h1 className="text-lg font-bold text-blue-600 tracking-wide">
          🧑‍🤝‍🧑 CollabBoard
        </h1>
      </div>

      {/* Clear button */}
      <button
        onClick={clearCanvas}
        className="ml-auto px-4 py-1.5 rounded-md bg-red-500 text-white font-medium shadow hover:bg-red-600 transition-colors duration-200"
      >
        Clear
      </button>

      {/* Online Users */}
      <button
        id="activeusers"
        onClick={() => handleUsers()}
        className="px-3 py-1.5 rounded-md bg-white  text-black font-medium shadow hover:bg-blue-100 transition-colors duration-200"
      >
        Show Users
      </button>
      <GetALLUser showUsers={showUsers} setShowUsers={setShowUsers} />

{/* 


         <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-blue-500  rounded-lg hover:bg-blue-600"
        >
          Chat
        </button> 





 {isChatOpen && (
  <ChatPanel usernam={currentUserName} roomId={currentroomId } onClose={()=>setIsChatOpen(false)}/>
 )}
 */}


      {/* RoomId */}
      <button
        onClick={showRoomId}
        className="px-3 py-1.5 rounded-md bg-white-500 text-black font-medium shadow hover:bg-blue-100 transition-colors duration-200"
      >
        Room ID
      </button>
      <RoomId showRoom={showRoom} setShowRoom={setShowRoom} />
    </div>
  );
};

export default Navbar;
