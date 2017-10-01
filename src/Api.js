import io from 'socket.io-client';

var socket;

if (window.location.port == 3001) {
    socket = io(window.location.protocol + "//" + window.location.hostname + ":3000", { 'transports': ['websocket', 'polling'] });
}
else {
    socket = io(window.location.protocol + "//" + window.location.hostname + ":" + window.location.port, { 'transports': ['websocket', 'polling'] });
}

function subscribeToRoom(roomId, callbackConnectionInfo, callbackCodeUpdate, callbackUserDisconnect) {
    socket.emit('connectToRoom', { roomId: roomId });
    socket.on('newConnection', code => callbackConnectionInfo(null, code.roomId, code.socketId, code.connections));
    socket.on('codeUpdate', code => callbackCodeUpdate(null, code.code));
    socket.on('userDisconnected', code => callbackUserDisconnect(null, code.socketId));
}

function submitCodeUpdate(roomId, code) {
    socket.emit('codeChange', { code: code, roomId: roomId, socketId: socket.id });
}

export { subscribeToRoom, submitCodeUpdate };