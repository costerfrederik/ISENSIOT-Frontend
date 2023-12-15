import { reactive } from 'vue';
import { io } from 'socket.io-client';
import { MapDataObject } from './interfaces/MapData';

// You can specify here the url for the sockets backend
const url = 'http://localhost:3000';

// Create the socket connection
export const socket = io(url);

// Here our state will be declared
export const socketState = reactive<{ connected: boolean; mapData: MapDataObject[] }>({
    connected: false,
    mapData: [],
});

// Set new mapdata when server sends it to us
socket.on('refresh_needed', (payload: MapDataObject[]) => {
    socketState.mapData = payload;
});

// Manually refresh map data
export function requestData() {
    socket.emit('data_request');
}
