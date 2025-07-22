import { Server } from "socket.io";

const io = new Server({
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"]
    }
});

io.listen(4000);

io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    socket.on("join-room", (roomId) => {
        const room = io.sockets.adapter.rooms.get(roomId);
        const numClients = room ? room.size : 0;

        console.log("Room:", roomId, "Clients:", numClients);

        if (numClients === 0) {
            socket.join(roomId);
            socket.emit("created");
        } else if (numClients === 1) {
            socket.join(roomId);
            socket.emit("joined");
            socket.to(roomId).emit("ready");
        } else {
            socket.emit("full");
        }
        console.log("here");
    });

    // WebRTC signaling
    socket.on("offer", (offer, roomId) => {
        socket.to(roomId).emit("offer", offer);
    });

    socket.on("answer", (answer, roomId) => {
        socket.to(roomId).emit("answer", answer);
    });

    socket.on("ice-candidate", (candidate, roomId) => {
        socket.to(roomId).emit("ice-candidate", candidate);
    });

    socket.on("disconnect", () => {
        console.log("Disconnected:", socket.id);
    });
});

export default io;