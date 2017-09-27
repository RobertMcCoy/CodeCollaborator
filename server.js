var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var path = require('path');

server.listen(port);

var url = require('url');
const uuidv4 = require('uuid/v4');

app.use(express.static(path.join(__dirname, '/build')));

app.get('/', function (req, res) {
  res.sendfile(path.join(__dirname+'/build/index.html'));
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
    io.sockets.in(roomId).emit('newConnection', { roomId: roomId });
  });

  socket.on('unsubscribeFromRoom', function(data) {
    console.log('A connection has been disconnected from: ' + data.roomId);
  });

  socket.on('codeChange', function (data) {
    console.log('Update to input detected: ' + data.code);
    io.sockets.in(data.roomId).emit('codeUpdate', data)
  });
});
