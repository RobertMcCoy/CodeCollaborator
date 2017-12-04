var express = require('express');
var app = express();
var path = require('path');
var helmet = require('helmet');
var logger = require('morgan');
var favicon = require('serve-favicon')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('../routes/index');
var api = require('../routes/api');
const passport = require('passport');
var models = require('../server/models');
require('../server/config/passport')(passport, models.User);
const uuidv4 = require('uuid/v4');
const port = process.env.PORT || 3000;

models.Users.sequelize.sync();

app.set('port', port);
app.set('views', path.join(__dirname, '/../views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use(express.static(path.join(__dirname, "/../build")));

app.use('/api', api);
app.use('/auth', routes);

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, '/../build/index.html'));
});

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

io.on('connection', socketSetup);

server.listen(app.get('port'), function() {
    console.log("Express started on port: " + app.get('port'));
});

let connections = [];

function socketSetup (socket) {
  io.set("transports", ["polling"]);
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
        currentCode: "",
        currentMode: "javascript"
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

  socket.on('modeChange', function (data) {
    for (var i = 0; i < connections.length; i++) {
      if (connections[i].roomId === data.roomId) {
        connections[i].currentMode = data.mode;
      }
    }
    socket.in(data.roomId).emit('modeUpdate', data);
  });
};

module.exports = app;