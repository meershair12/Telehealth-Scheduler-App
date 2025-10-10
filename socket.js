const { Server } = require("socket.io");
const { BASE_URL } = require("./config/URL");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: BASE_URL, // React frontend ka URL
      // origin: "", // React frontend ka URL
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}

module.exports = { initSocket, getIO };
