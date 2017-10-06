var socketServer = require('./socket-server');
socketServer.app.set('port', process.env.PORT || 3000);
var server = socketServer.server.listen(process.env.PORT || 3000, function() {
  console.log('Express server listening on port ' + server.address().port);
});
