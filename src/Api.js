import io from 'socket.io-client';
var socket;

instantiateSocket();

function instantiateSocket() {
    if (window.location.host.indexOf('localhost') >= 0) {
        socket = io.connect('http://localhost:3000', { 'transports': ['polling', 'websocket'], 'reconnection': true, 'reconnectionDelay': 500, 'reconnectionAttempts': 10 });
    } else {
        socket = io.connect({ 'transports': ['polling', 'websocket'], 'reconnection': true, 'reconnectionDelay': 500, 'reconnectionAttempts': 10 });
    }
}

function subscribeToRoom(roomId, userName, callbackConnectionInfo, callbackCodeUpdate, callbackUserDisconnect) {
    socket.open();
    socket.emit('connectToRoom', { roomId: roomId, userName: userName });
    socket.on('newConnection', code => callbackConnectionInfo(null, code.roomId, code.socketId, code.userName, code.connections));
    socket.on('codeUpdate', code => callbackCodeUpdate(null, code.code));
    socket.on('userDisconnected', code => callbackUserDisconnect(null, code.userName));
}

function submitCodeUpdate(roomId, code) {
    socket.emit('codeChange', { code: code, roomId: roomId, socketId: socket.id });
}

function leaveExistingLastRoom() {
    socket.disconnect();
    instantiateSocket();
}

export { subscribeToRoom, submitCodeUpdate, leaveExistingLastRoom };