var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var path = require('path');

app.use('/js', express.static(path.join(__dirname, 'js')));

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});


var url = require('url');
const uuidv4 = require('uuid/v4');


app.get('/', function (req, res) {
  res.sendfile('index.html');
});


io.on('connection', function (socket) {
  io.set('transports', ['websocket']);

  socket.on('connectToRoom', function (data) {
    console.log('Resolving for new connection');
    var roomId = "";
    if (data != null && data.roomId != null) {
      roomId = data.roomId;
    }
    if (roomId == "") {
      roomId = uuidv4();
    }
    socket.join(roomId);
    io.sockets.in(roomId).emit('newConnection', { message: 'Connected to new room: ' + roomId, roomId: roomId });
  });

  socket.on('codeChange', function (data) {
    console.log('Update to input detected: ' + data.code);
    io.sockets.in(data.roomId).emit('codeUpdate', data)
  });
});
