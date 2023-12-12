import { reactive } from 'vue';
import { io } from 'socket.io-client';

// Here our state will be declared
export const socketState = reactive({
    connected: false,
    events: [],
    payload: {},
});

// You can specify here the url for the sockets backend
const url = 'http://localhost:3000';

// Create the socket connection
export const socket = io(url);

// Set state when it receives positionChange
socket.on('table_updated', (payload) => {
    socketState.payload = payload;
});
