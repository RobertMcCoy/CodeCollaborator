var app = require('./app');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const uuidv4 = require('uuid/v4');

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
    var connectionsRoomIndex;
    for (var i = 0; i < connections.length; i++) {
      if (connections[i].roomId === roomId) {
        connectionsRoomIndex = i;
        socketFound = true;
        connections[i].currentConnections.push({socketId: socket.id, userName: data.userName});
        socket.emit('codeUpdate', { roomId: connections[i].roomId, code: connections[i].currentCode });
      }
    }
    if (!socketFound) {
      connectionsRoomIndex = 0;
      connections.push({ 
        roomId: roomId, 
        currentConnections: [{socketId: socket.id, userName: data.userName}],
        currentCode: ""
      });
    }
    io.sockets.in(roomId).emit('newConnection', { roomId: roomId, socketId: socket.id, userName: data.userName, connections: connections[connectionsRoomIndex] });
  });

  socket.on('disconnecting', function() {
    for (var room in socket.rooms) {
      for (var i = 0; i < connections.length; i++) {
        if (connections[i].roomId == room) {
          for (var j = 0; j < connections[i].currentConnections.length; j++) {
            if (connections[i].currentConnections[j].socketId == socket.id) {
              socket.to(room).emit('userDisconnected', { socketId: socket.id, userName: connections[i].currentConnections[j].userName });
              connections[i].currentConnections.splice(j, 1);
              break;
            }
          }
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
    socket.to(data.roomId).emit('codeUpdate', data);
  });
});

module.exports = { io, connections, server, app };