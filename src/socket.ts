import { reactive } from "vue";
import { io } from "socket.io-client";
import { MapDataObject } from "./interfaces/MapData";
import { useMapStore } from "@/stores/map";
import { Taxi } from "./interfaces/Taxi";

// You can specify here the url for the sockets backend
const url = "http://localhost:3000";

// Create the socket connection
export const socket = io(url);

// Here our state will be declared
export const socketState = reactive({
  connected: false,
});

// Set new mapdata when server sends it to us
socket.on("refresh_needed", (payload: MapDataObject[]) => {
  const mapStore = useMapStore();
  mapStore.setMapData(payload);
});

// Manually refresh map data
export function requestData() {
  socket.emit("data_request");
}

export function createTaxi(newTaxi: Taxi) {
  socket.emit("taxi_create", newTaxi);
}

socket.on("taxi_inserted", (response: string) => {
  alert(response);
});
