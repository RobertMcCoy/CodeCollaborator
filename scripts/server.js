var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var session = require('express-session');
var port = process.env.PORT || 3000;
var path = require('path');
var helmet = require('helmet');
const passport = require('passport');
require('../server/config/passport')(passport);

server.listen(port);

var url = require('url');
const uuidv4 = require('uuid/v4');

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: false }));
app.use(require('body-parser').json());
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());
app.use(function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
});

app.use(express.static(path.join(__dirname, "/../build")));

app.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login'
}));

app.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup'
}));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + "/../build/index.html"));
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
};

var models = require("../server/models");
models.sequelize.sync().then(function() {
   console.log('Database synced without errors')
}).catch(function(err) {
   console.log(err, "Database encountered an error when syncing")
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
    //Using socket.to will not resend to the sending socket
    socket.to(data.roomId).emit('codeUpdate', data);
  });
});
