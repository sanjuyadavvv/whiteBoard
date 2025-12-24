import React, { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import socket from "./socket.jsx"; // shared socket file (ensure it's exported)

const ChatPanel = ({ username, roomId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    // Join room when panel mounts
    socket.emit("join-room", roomId);

    // Listen for messages
    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const msgData = { username, roomId, message: input };
    socket.emit("send-message", msgData);
    setMessages((prev) => [...prev, msgData]);
    setInput("");
  };

  return (
    <div className="fixed right-4 bottom-4 w-80 h-96 bg-white border rounded-2xl shadow-lg flex flex-col">
      <div className="flex items-center justify-between p-3 border-b bg-blue-500 text-white rounded-t-2xl">
        <h2 className="text-lg font-semibold">Chat</h2>
        <X className="cursor-pointer" onClick={onClose} />
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg max-w-[75%] ${
              msg.username === username
                ? "bg-blue-100 self-end ml-auto text-right"
                : "bg-gray-100"
            }`}
          >
            <p className="text-sm font-semibold">{msg.username}</p>
            <p>{msg.message}</p>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      <form onSubmit={handleSend} className="flex p-2 border-t">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none"
        />
        <button
          type="submit"
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
