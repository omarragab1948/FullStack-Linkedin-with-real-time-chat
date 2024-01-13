// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);
  socket.on("send message", (message, roomId) => {
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
    console.log(receiver);
    socket.broadcast
      .to(receiver?.requesterId)
      .emit("connect rejected", receiver);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});