/**
 * Created by pawan on 18/2/17.
 */
const express = require('express');
const app = express();
const http = require('http');
const server = http.Server(app);
const socket = require('socket.io');
const io = socket(server);

var chatList = [];
var clients = {};

io.on("connection", function (conn) {
    console.log("a client connected");
    conn.emit("new_conn", chatList);

    conn.on("myevent", function (data) {
        clients[data] = conn.id;
    });

    conn.on("send_msg", function (data) {
        if (data.msg.charAt(0) == '@') {
            let user = data.msg.split(" ", 1)[0].substring(1);
            let msg = data.msg.substring(data.msg.indexOf(" ")+1);
            io.to(clients[user]).emit("rcv_msg", {name: data.name, msg: msg});
        }
        else {
            chatList.push(data);
            io.emit("rcv_msg", data);
            // conn.broadcast.emit("rcv_msg", data);
        }
    });

    conn.on("disconnect", function (data) {
        console.log("User has disconnected " + data)
    });
});

app.use('/', express.static(__dirname + "/public"));

server.listen(3456, () => {
    console.log('Started on 3456')
});