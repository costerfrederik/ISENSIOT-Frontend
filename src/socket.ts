import { reactive } from 'vue';
import { io } from 'socket.io-client';
import { MapDataObject } from './interfaces/MapData';
import { useMapStore } from '@/stores/map';
import { Taxi } from './interfaces/Taxi';
import { useErrorStore } from '@/stores/error';
import { FormError } from '@/interfaces/FormError';
import { Position } from 'geojson';

// You can specify here the url for the sockets backend
const url = 'http://localhost:3000';

// Create the socket connection
export const socket = io(url);

// Here our state will be declared
export const socketState = reactive({
    connected: false,
});

// Set new mapdata when server sends it to us
socket.on('refresh_needed', (payload: MapDataObject[]) => {
    const mapStore = useMapStore();
    mapStore.setMapData(payload);
});

// Manually refresh map data
export function requestData() {
    socket.emit('data_request');
}

export function createTaxi(newTaxi: Taxi) {
    socket.emit('taxi_create', newTaxi);
}

export function updateFence(identifier: string, multiPolygonCoordinates: Position[][][]) {
    console.log(multiPolygonCoordinates);

    const fencesObject = {
        fences: multiPolygonCoordinates.map((subArray) => ({
            coordinates: subArray.map((coordinate) => [
                coordinate[0], // longitude
                coordinate[1], // latitude
            ]),
        })),
    };

    console.log(fencesObject);

    socket.emit('fence_update', fencesObject);
}

socket.on('taxi_inserted', (response: FormError) => {
    const formErrorStore = useErrorStore();

    formErrorStore.error = response;
});
