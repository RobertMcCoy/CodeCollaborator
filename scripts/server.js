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

io.on('connection', function (socket) {
  io.set('transports', ['websocket', 'polling']);

  socket.on('connectToRoom', function (data) {
    var roomId = "";
    if (data != null && data.roomId != null) {
      roomId = data.roomId;
    }
    if (roomId == "") {
      roomId = uuidv4();
    }
    console.log('Connection resolved for room: ' + roomId);
    socket.join(roomId);
    io.sockets.in(roomId).emit('newConnection', { roomId: roomId, socketId: socket.id });
  });

  socket.on('codeChange', function (data) {
    //Using socket.to will not resend to the sending socket
    socket.to(data.roomId).emit('codeUpdate', data);
  });
});
