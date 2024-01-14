// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(
  cors({
    origin: "https://full-stack-linkedin-with-real-time-chat.vercel.app",
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://full-stack-linkedin-with-real-time-chat.vercel.app",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);
  socket.on("send message", (message, roomId) => {
    console.log("room", roomId);
    console.log("message", message);

    socket.to(roomId).emit("received message", message);
  });

  socket.on("send connect", (receiver, sender) => {
    socket.broadcast
      .to(receiver?._id)
      .emit("received connect", { receiver, sender });
  });
  socket.on("accept connect", (receiver) => {
    socket.broadcast
      .to(receiver?.requesterId)
      .emit("connect accepted", receiver);
  });
  socket.on("reject connect", (receiver) => {
    socket.broadcast
      .to(receiver?.requesterId)
      .emit("connect rejected", receiver);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
