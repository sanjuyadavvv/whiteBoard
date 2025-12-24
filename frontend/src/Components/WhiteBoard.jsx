
// this is the final code for the project 



// this is the most correct one use this if the code fails 








import { useRef, useEffect, useState } from "react";
import Navbar from "./Navbar";
// import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { setRoomId } from "./features/userSlice";
import { throttle } from "lodash";
import socket from './socket.jsx'

// const socket = io("https://collabboard-cseg.onrender.com");

const Whiteboard = () => {
  const { roomId } = useParams();
  const dispatch = useDispatch();

  const [tool, setTool] = useState("pen"); // pen, eraser, line, rect, square, circle
  const [lineWidth, setLineWidth] = useState(3);
  const [color, setColor] = useState("#000000");
  const [isDrawing, setIsDrawing] = useState(false);

  const canvasRef = useRef(null);
  const overlayRef = useRef(null); // overlay for shape preview
  const ctxRef = useRef(null);
  const overlayCtxRef = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });

  // throttled socket emitter
  const emitDraw = useRef(
    throttle((data) => {
      socket.emit("draw", data);
    }, 16)
  ).current;

  // ===== Drawing Helpers =====
  const drawLine = (ctx, x0, y0, x1, y1) => {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  };

  const drawRect = (ctx, x0, y0, x1, y1, square = false) => {
    const w = x1 - x0;
    const h = y1 - y0;
    ctx.beginPath();
    ctx.rect(x0, y0, square ? Math.sign(w) * Math.min(Math.abs(w), Math.abs(h)) : w, h);
    ctx.stroke();
  };

  const drawCircle = (ctx, x0, y0, x1, y1) => {
    const radius = Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2);
    ctx.beginPath();
    ctx.arc(x0, y0, radius, 0, 2 * Math.PI);
    ctx.stroke();
  };

  const commitShape = (x0, y0, x1, y1) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;

    switch (tool) {
      case "line":
        drawLine(ctx, x0, y0, x1, y1);
        break;
      case "rect":
        drawRect(ctx, x0, y0, x1, y1, false);
        break;
      case "square":
        drawRect(ctx, x0, y0, x1, y1, true);
        break;
      case "circle":
        drawCircle(ctx, x0, y0, x1, y1);
        break;
      default:
        break;
    }

    // Emit to other users
    emitDraw({ roomId, tool, color, lineWidth, x0, y0, x1, y1 });
  };

  // ===== Handlers =====
 const startDrawing = (e) => {
  const x = e.nativeEvent.offsetX;
  const y = e.nativeEvent.offsetY;
  startPos.current = { x, y };

  if (tool === "text") {
    const userText = prompt("Enter text:");
    commitText(x, y, userText);
    return; // don't set isDrawing
  }

  setIsDrawing(true);
  if (tool === "pen" || tool === "eraser") {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  }
};
  const draw = (e) => {
    if (!isDrawing) return;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    const ctx = ctxRef.current;
    const overlayCtx = overlayCtxRef.current;
    if (!ctx || !overlayCtx) return;

    overlayCtx.clearRect(0, 0, overlayCtx.canvas.width, overlayCtx.canvas.height);

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;

    if (tool === "pen" || tool === "eraser") {
      ctx.lineTo(x, y);
      ctx.stroke();
      emitDraw({ roomId, tool, color, lineWidth, x0: startPos.current.x, y0: startPos.current.y, x1: x, y1: y });
      startPos.current = { x, y };
    } else {
      overlayCtx.lineWidth = lineWidth;
      overlayCtx.strokeStyle = color;
      switch (tool) {
        case "line":
          drawLine(overlayCtx, startPos.current.x, startPos.current.y, x, y);
          break;
        case "rect":
          drawRect(overlayCtx, startPos.current.x, startPos.current.y, x, y);
          break;
        case "square":
          drawRect(overlayCtx, startPos.current.x, startPos.current.y, x, y, true);
          break;
        case "circle":
          drawCircle(overlayCtx, startPos.current.x, startPos.current.y, x, y);
          break;
        default:
          break;
      }
    }
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if (tool !== "pen" && tool !== "eraser") {
      commitShape(startPos.current.x, startPos.current.y, x, y);
      overlayCtxRef.current.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
    }
  };

  const clearCanvas = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    socket.emit("clear-canvas", roomId);
  };

  // ===== Setup =====
  useEffect(() => {




    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!canvas || !overlay) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    overlay.width = window.innerWidth;
    overlay.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    const overlayCtx = overlay.getContext("2d");

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctxRef.current = ctx;
    overlayCtxRef.current = overlayCtx;

    socket.emit("join-room", roomId);




// load hostory when joining 

  socket.on("load-canvas", (strokes) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // reset
    strokes.forEach((data) => {
      ctx.lineWidth = data.lineWidth;
      ctx.strokeStyle = data.tool === "eraser" ? "#ffffff" : data.color;

      switch (data.tool) {
        case "pen":
        case "eraser":
        case "line":
          drawLine(ctx, data.x0, data.y0, data.x1, data.y1);
          break;
        case "rect":
          drawRect(ctx, data.x0, data.y0, data.x1, data.y1, false);
          break;
        case "square":
          drawRect(ctx, data.x0, data.y0, data.x1, data.y1, true);
          break;
        case "circle":
          drawCircle(ctx, data.x0, data.y0, data.x1, data.y1);
          break;
        case "text":
          ctx.fillStyle = data.color;
          ctx.font = `${data.lineWidth * 5}px Arial`;
          ctx.fillText(data.text, data.x0, data.y0);
          break;
        default:
          break;
      }
    });
  });





if(socket){
  console.log('in whiteboard socket id is ',socket.id)
}





socket.on("draw", (data) => {
  if (!ctx) return;
  ctx.lineWidth = data.lineWidth;
  ctx.strokeStyle = data.tool === "eraser" ? "#ffffff" : data.color;

  switch (data.tool) {
    case "pen":
    case "eraser":
    case "line":
      drawLine(ctx, data.x0, data.y0, data.x1, data.y1);
      break;
    case "rect":
      drawRect(ctx, data.x0, data.y0, data.x1, data.y1, false);
      break;
    case "square":
      drawRect(ctx, data.x0, data.y0, data.x1, data.y1, true);
      break;
    case "circle":
      drawCircle(ctx, data.x0, data.y0, data.x1, data.y1);
      break;
    // case "text":
    //   ctx.fillStyle = data.color;
    //   ctx.font = `${data.lineWidth * 5}px Arial`;
    //   ctx.fillText(data.text, data.x0, data.y0);
    //   break;
    default:
      break;
  }
});




  socket.on("user-joined", ({ username }) => {
      toast.success(`${username} joined the room`);
    });



    socket.on("clear-canvas", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      socket.emit("leave-room", roomId);
      socket.off("draw");
      socket.off("clear-canvas");
    };
  }, [roomId]);

  useEffect(() => {
    if (roomId) dispatch(setRoomId(roomId));
  }, [roomId, dispatch]);

  return (
    <>
      <Navbar
        tool={tool}
        setTool={setTool}
        lineWidth={lineWidth}
        setLineWidth={setLineWidth}
        color={color}
        setColor={setColor}
        clearCanvas={clearCanvas}
      />
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="absolute top-0 left-0 bg-white"
      />
      <canvas
        ref={overlayRef}
        className="absolute top-0 left-0 pointer-events-none"
      />
    </>
  );
};

export default Whiteboard;



