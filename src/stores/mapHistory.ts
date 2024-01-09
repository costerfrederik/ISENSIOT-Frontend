import mapboxgl, { Marker } from "mapbox-gl";
import { defineStore } from "pinia";
import { MapDataObject } from "@/interfaces/MapData";
import { ref, watch } from "vue";
import type { Ref } from "vue";
import { useMapStore } from "./map";

export const useMapHistoryStore = defineStore("mapHistory", () => {
  const mapStore = useMapStore();
  const mapInstance: Ref<mapboxgl.Map | undefined> = ref();
  const mapIdentifier: Ref<string | undefined> = ref();
  const mapMarkers: Ref<Marker[]> = ref([]);
  const mapData: Ref<MapDataObject[]> = ref([]);

  watch(mapIdentifier, test);

  function test() {    
    const test = mapStore.mapData.find((mapDataObject: MapDataObject) => {
      return mapDataObject.identifier == mapIdentifier.value;
    });
  }

  // Method that sets map data, and removes all markers
    function setMapData(mapDataObjects: MapDataObject[]) {
      mapData.value = mapDataObjects;

      removeAllMapMarkers();
    }

  // Method that removes all markers from map
  function removeAllMapMarkers() {
    mapMarkers.value.forEach((marker: Marker) => {
      marker.remove();
    });
  }

  // Resets all store state to initial values
  function resetStateToInitial() {
    if (mapInstance.value) {
      mapInstance.value.remove();
      mapInstance.value = undefined;
    }
    mapMarkers.value = [];
  }

  return {
    mapInstance,
    mapIdentifier,
    mapMarkers,
    setMapData,
    removeAllMapMarkers,
    resetStateToInitial,
  };
});
