import os from "node:os";
import { Server } from "socket.io";
import dns from "node:dns";

const interfaces = os.networkInterfaces();
const ip = getHostname();

const io = new Server({
    cors: {
        origin: "*"
    }
})

io.on("connection", (socket) => {
    console.log(socket.id);
});

console.log(os.hostname());

checkOverloaded();

setInterval(() => {
    const free = os.freemem() / 1024 / 1024 / 1024;
    const total = os.totalmem() / 1024 / 1024 / 1024;
    const cpus = os.cpus();

    const payload = {
        hostname: os.hostname(),
        cpus: cpus,
        total: total,
        free: free
    }

    checkOverloaded();

    io.emit(ip + "-hardware", payload);

}, 1000);

function checkOverloaded() {
    const maxMemoryValue = 0.1 * os.totalmem();

    if (os.freemem() < maxMemoryValue) {
        io.emit("overloaded", "System overloaded !!!");
    }

}

function getHostname() {
    for (var devName in interfaces) {
        var iface = interfaces[devName];

        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
                return alias.address;
        }
    }
    return '0.0.0.0';
}

io.listen(3000);
