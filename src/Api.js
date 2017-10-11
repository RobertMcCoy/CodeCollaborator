import io from 'socket.io-client';

var socket;
instantiateSocket();

function instantiateSocket() {
    if (window.location.port == 3002) {
        socket = io(window.location.protocol + "//" + window.location.hostname + ":3001", { 'transports': ['websocket', 'polling'] });
    }
    else {
        socket = io(window.location.protocol + "//" + window.location.hostname + ":" + window.location.port, { 'transports': ['websocket', 'polling'] });
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