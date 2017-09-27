import io from 'socket.io-client';
const socket = io(window.location.href, {'transports': ['websocket', 'polling']});

function subscribeToRoom(roomId, callbackConnectionInfo, callbackCodeUpdate, callbackDisconnect) {
    socket.emit('connectToRoom', {roomId: roomId});
    socket.on('newConnection', code => callbackConnectionInfo(null, code.roomId));
    socket.on('codeUpdate', code => callbackCodeUpdate(null, code.code));
    socket.on('disconnect', code => callbackDisconnect(null, code.userId));
}

function submitCodeUpdate(roomId, code) {
    socket.emit('codeChange', { code: code, roomId: roomId });
}

export { subscribeToRoom, submitCodeUpdate };