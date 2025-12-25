
import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import connect from "./db.js";
import Drawing from "./models/Drawing.js";
import fs from "fs";


dotenv.config();
connect();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
      origin: [
    "http://localhost:5173", // for local dev
    "https://collabboard-fe.onrender.com", // your deployed frontend
    "https://collabboard-cseg.onrender.com/"
  ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// ✅ Cache drawings in memory
let roomCache = {}; 

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("join-room", async (roomId) => {
    socket.join(roomId);

    if (!roomCache[roomId]) {
      const existing = await Drawing.findOne({ roomId });
      roomCache[roomId] = existing ? existing.strokes : [];
    }

    // send canvas state to the new user
    socket.emit("load-canvas", roomCache[roomId]);

  });

  socket.on("draw", ({ roomId, ...data }) => {
    if (!roomCache[roomId]) roomCache[roomId] = [];
    roomCache[roomId].push(data);

    // broadcast to all except sender
    socket.to(roomId).emit("draw", data);
  });

  socket.on("clear-canvas", async (roomId) => {
    roomCache[roomId] = [];
    await Drawing.updateOne({ roomId }, { strokes: [] }, { upsert: true });
    io.to(roomId).emit("clear-canvas"); // ✅ notify everyone
  });




// when someone sends a message 
socket.on("send-message",(data)=>{
  io.to(data.roomId).emit("receive-message",data);
})













  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
  });







//  socket.leave(roomId);



  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});




// ✅ Single interval for all rooms (not per user)
setInterval(async () => {
  for (const roomId in roomCache) {
    const strokes = roomCache[roomId];
    await Drawing.updateOne({ roomId }, { strokes }, { upsert: true });
  }
}, 5000);

app.use("/api/auth", authRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.resolve(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    const indexPath = path.join(frontendPath, "index.html");
    if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
    return res.status(404).send("Frontend not built yet");
  });
}

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});











