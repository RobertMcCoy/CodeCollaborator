import ioClient from 'socket.io-client';
const socket = ioClient('http://localhost:3000', {'transports': ['websocket', 'polling']});

function subscribeToRoom(cb) {
    socket.emit('connectToRoom');
    socket.on('newConnection', code => cb(null, code.roomId));
}

function getCodeUpdate(cb) {
    socket.on('codeUpdate', code => cb(null, code.roomId, code.code));
}

function submitCodeUpdate(roomId, code) {
    socket.emit('codeChange', { code: code, roomId: roomId });
}

export { subscribeToRoom, getCodeUpdate, submitCodeUpdate };