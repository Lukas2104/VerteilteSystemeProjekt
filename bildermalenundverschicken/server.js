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
        // Weiterleiten der Signalisierungsnachricht an andere Clients
        socket.broadcast.emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });

    socket.on("new_peer", (data) => {
        socket.broadcast.emit("new_peer", { from: socket.id });
    });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
