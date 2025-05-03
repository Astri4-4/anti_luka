import os from "node:os";
import {Server} from "socket.io";

const io = new Server({
    cors: {
        origin: "0.0.0.0/24"
    }
})

io.on("connection", (socket) => {
    console.log(socket.id);
});

checkOverloaded();

setInterval(() => {
    const free = os.freemem()/1024/1024/1024;
    const total = os.totalmem()/1024/1024/1024;
    const cpus = os.cpus();

    const payload = {
        cpus: cpus,
        total: total,
        free: free
    }

    checkOverloaded();

    io.emit("hardware", payload);

}, 1000);

function checkOverloaded() {
    const maxMemoryValue = 0.1*os.totalmem();
    console.log(maxMemoryValue/1024/1024/1024);

    if (os.freemem() < maxMemoryValue) {
        io.emit("overloaded", "System overloaded !!!");
    }

}

io.listen(3000);
