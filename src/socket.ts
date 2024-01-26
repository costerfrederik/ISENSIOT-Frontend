import { reactive } from 'vue';
import { io } from 'socket.io-client';
import { MapDataObject } from './interfaces/MapData';
import { useMapStore } from '@/stores/map';
import { useViolationStore } from './stores/violation';
import { Taxi } from './interfaces/Taxi';
import { useErrorStore } from '@/stores/error';
import { FormError } from '@/interfaces/FormError';
import { MultiPolygon } from 'geojson';
import { useFenceStore } from './stores/fence';
import { Violation } from './interfaces/Violation';

// You can specify here the url for the sockets backend
const url = 'http://localhost:3000';

// Create the socket connection
export const socket = io(url);

// Here our state will be declared
export const socketState = reactive({
    connected: false,
});

// Request a map data refresh
export function requestData() {
    socket.emit('data_request');
}
socket.on('refresh_needed', (payload: MapDataObject[]) => {
    const mapStore = useMapStore();
    mapStore.setMapData(payload);
});

// Request creation of new taxi
export function createTaxi(newTaxi: Taxi) {
    socket.emit('taxi_create', newTaxi);
}
socket.on('taxi_inserted', (response: FormError) => {
    const formErrorStore = useErrorStore();
    formErrorStore.error = response;
});

// Request creation/update of fence
export function saveFence(identifier: string, multiPolygon: MultiPolygon) {
    socket.emit('fence_save', {
        identifier: identifier,
        multiPolygon: multiPolygon,
    });
}

// Request a fence data refresh
export function reDrawFence(identifier: string) {
    socket.emit('fence_redraw', identifier);
}
socket.on('fence_redraw_response', (multiPolygon: MultiPolygon | undefined) => {
    const fenceStore = useFenceStore();

    fenceStore.drawLocal = multiPolygon;
    fenceStore.drawDB = multiPolygon;

    fenceStore.addPolygonsToInstance(multiPolygon);
});

// Request a map data refresh
export function requestViolations() {
    socket.emit('violations_request');
}
socket.on('violations_request_response', (payload: Violation[]) => {
    const violationStore = useViolationStore();
    violationStore.violationLog = payload;
});
