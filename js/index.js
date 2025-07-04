const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
    }
});

app.use(cors());
app.use(express.static(__dirname + '/../public'));

const users = {};

io.on('connection', (socket) => {

    // Jab naye client connect hote hain unhe purane users ka naam bheje:
    socket.emit('existing-users', Object.values(users));

    socket.on('new-user-joined', (name) => {
        console.log("New User", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', (message) => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });

    socket.on('disconnect', () => {
        const name = users[socket.id];  // Save before deleting
        delete users[socket.id];

        // Check if this user name still exists in other sockets
        const stillConnected = Object.values(users).includes(name);

        if (!stillConnected && name) {
            socket.broadcast.emit('left', name);
        }
    });


});

http.listen(8000, () => {
    console.log("Server started at http://localhost:8000");
});
