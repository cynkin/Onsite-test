import { Server } from "socket.io";
const io = new Server(4000, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("Connected : ", socket.id);
    console.log("Total clients : ", io.engine.clientsCount)

    socket.on("auth-user", (id) => {
        socket.data.id = id;
        // console.log(socket.data);
    })

    socket.on("disconnect", () => {
        console.log("Disconnected : ", socket.id);
        console.log("Remaining clients : ", io.engine.clientsCount)
    })
})