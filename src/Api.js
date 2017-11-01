import io from 'socket.io-client';
var socket;

instantiateSocket();

function instantiateSocket() {
    console.log(window.location.host);
    if (window.location.host === "localhost:3001") {
        socket = io.connect('http://localhost:3000', { 'transports': ['polling'] });
    }
    else {
        socket = io.connect({ 'transports': ['polling'] });
    }
}

function subscribeToRoom(roomId, userName, callbackConnectionInfo, callbackCodeUpdate, callbackUserDisconnect, callbackModeUpdate) {
    socket.open();
    socket.emit('connectToRoom', { roomId: roomId, userName: userName });
    socket.on('newConnection', code => callbackConnectionInfo(null, code.roomId, code.socketId, code.userName, code.connections));
    socket.on('codeUpdate', code => callbackCodeUpdate(null, code.code));
    socket.on('userDisconnected', code => callbackUserDisconnect(null, code.userName));
    socket.on('modeUpdate', code => callbackModeUpdate(null, code.mode));
}

function submitCodeUpdate(roomId, code) {
    socket.emit('codeChange', { code: code, roomId: roomId, socketId: socket.id });
}

function submitModeChange(roomId, mode) {
    socket.emit('modeChange', {roomId: roomId, mode: mode, socketId: socket.id})
}

function leaveExistingLastRoom() {
    socket.disconnect();
    instantiateSocket();
}

export { subscribeToRoom, submitCodeUpdate, leaveExistingLastRoom, submitModeChange };