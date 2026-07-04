import { Server } from "socket.io"
import cors from "cors"



let io;

export function initSocket(httpServer){
 io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Allow specific frontend origins
    credentials:true,
  },
});

console.log("Socket.io server is running");


// Handle client connections
io.on("connection", (socket)=>{
  console.log("A user connected" + socket.id)
})
}


export function getIO(){
  if(!io){
    throw new Error("Socket.io not initialized")
  }

  return io
};





