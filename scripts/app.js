var express = require('express');
var app = express();
var session = require('express-session');
var path = require('path');
var helmet = require('helmet');
var logger = require('morgan');
var favicon = require('serve-favicon')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('../routes/index');
const passport = require('passport');
require('../server/config/passport')(passport);
var server = require('http').Server(app);
var io = require('socket.io')(server);
const uuidv4 = require('uuid/v4');
const port = process.env.PORT || 3000;

var models = require("../server/models");
models.sequelize.sync();

io.on('connection', socketSetup);

app.set('views', path.join(__dirname, '/../views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

app.use(session({ secret: (process.env.EXPRESS_SESSION_SECRET || "secret"), saveUninitialized: false, resave: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('*', express.static(path.join(__dirname, "/../build")));

app.use('/auth', routes);

app.listen(port);
server.listen(80);

let connections = [];

function socketSetup (socket) {
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
};

module.exports = app;