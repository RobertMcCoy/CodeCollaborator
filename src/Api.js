import io from 'socket.io-client';
const socket = io(window.location.href, {'transports': ['websocket', 'polling']});

function subscribeToRoom(roomId, callbackConnectionInfo, callbackCodeUpdate) {
    socket.emit('connectToRoom', {roomId: roomId});
    socket.on('newConnection', code => callbackConnectionInfo(null, code.roomId));
    socket.on('codeUpdate', code => callbackCodeUpdate(null, code.code));
}

function submitCodeUpdate(roomId, code) {
    socket.emit('codeChange', { code: code, roomId: roomId });
}

function unsubscribeFromRoom(roomId) {
    socket.emit('unsubscribeFromRoom', {roomId: roomId});
}

export { subscribeToRoom, submitCodeUpdate, unsubscribeFromRoom };