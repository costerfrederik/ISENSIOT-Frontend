import { reactive } from 'vue';
import { io } from 'socket.io-client';
import { MapDataPoint } from './interfaces/MapData';

// Here our state will be declared
export const socketState = reactive<{ connected: boolean; mapData: MapDataPoint[] }>({
    connected: false,
    mapData: [],
});

// You can specify here the url for the sockets backend
const url = 'http://localhost:3000';

// Create the socket connection
export const socket = io(url);

// Set mapdata when it receives refresh
socket.on('refresh_needed', (payload: MapDataPoint[]) => {
    socketState.mapData = payload;
});
