var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var path = require('path');

server.listen(port);

var url = require('url');
const uuidv4 = require('uuid/v4');

app.use(express.static(path.join(__dirname, "/../build")));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + "/../build/index.html"));
});

let connections = [];

io.on('connection', function (socket) {
  io.set('transports', ['websocket', 'polling']);

  socket.on('connectToRoom', function (data) {
    var roomId = "";
    if (data != null && data.roomId != null) {
      roomId = data.roomId;
    }
    if (roomId === "") {
      roomId = uuidv4();
    }

    socket.join(roomId);

    var socketFound = false;
    for (var i = 0; i < connections.length; i++) {
      if (connections[i].roomId === roomId) {
        socketFound = true;
        connections[i].currentConnections.push(socket.id);
        socket.emit('codeUpdate', { roomId: connections[i].roomId, code: connections[i].currentCode });
      }
    }
    if (!socketFound) {
      connections.push({ 
        roomId: roomId, 
        currentConnections: [socket.id],
        currentCode: ""
      });
    }
    io.sockets.in(roomId).emit('newConnection', { roomId: roomId, socketId: socket.id });
  });

  socket.on('disconnecting', function() {
    for (var room in socket.rooms) {
      socket.to(room).emit('userDisconnected', { socketId: socket.id });
      for (var i = 0; i < connections.length; i++) {
        if (connections[i].roomId == room) {
          var currentUserLocation = connections[i].currentConnections.indexOf(socket.id);
          connections[i].currentConnections.splice(currentUserLocation, 1);
        }
      }
    }
  })

  socket.on('codeChange', function (data) {
    for (var i = 0; i < connections.length; i++) {
      if (connections[i].roomId === data.roomId) {
        connections[i].currentCode = data.code;
      }
    }
    //Using socket.to will not resend to the sending socket
    socket.to(data.roomId).emit('codeUpdate', data);
  });
});
