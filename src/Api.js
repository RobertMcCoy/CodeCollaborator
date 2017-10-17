import io from 'socket.io-client';
var port = process.env.PORT || 3000;
port = port + 1;
var socket;
instantiateSocket();

function instantiateSocket() {
    socket = io(window.location.protocol + "//" + window.location.hostname + ":" + port, { 'transports': ['websocket'] });
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
    console.log('in submit mode change');
    console.log('submitcodechange: ' + mode)
    socket.emit('modeChange', {roomId: roomId, mode: mode, socketId: socket.id})
}

function leaveExistingLastRoom() {
    socket.disconnect();
    instantiateSocket();
}

export { subscribeToRoom, submitCodeUpdate, leaveExistingLastRoom, submitModeChange };