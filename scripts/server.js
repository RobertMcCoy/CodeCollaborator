var socketServer = require('./socket-server');

socketServer.app.listen(process.env.PORT || 3000);

var server = socketServer.server.listen(process.env.PORT + 1 || 3000 + 1, function() {
  console.log('Socket server listening on port ' + server.address().port); 
});
