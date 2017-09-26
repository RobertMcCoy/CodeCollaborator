var express = require('express');
var app = express();
var http = require('http').Server(app);
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var port = process.env.PORT || 3000;
var url = require('url');
const uuidv4 = require('uuid/v4');

app.get('/', function (req, res) {
  res.sendfile('index.html');
});


app.listen(process.env.PORT, function(){
  console.log('>>>> app listening ' + port);
});

io.on('connection', function (socket) {

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
