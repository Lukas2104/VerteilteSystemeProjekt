const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("send_message", (data) => {
        socket.to(data.to).emit("receive_message", data);
    });

    socket.on("new_peer", (data) => {
        socket.broadcast.emit("new_peer", { from: socket.id });
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));