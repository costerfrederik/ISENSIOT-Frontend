import mapboxgl, { Marker } from 'mapbox-gl';
import { defineStore } from 'pinia';
import { MapDataObject } from '@/interfaces/MapData';
import { computed } from 'vue';
import { ref } from 'vue';
import type { Ref } from 'vue';

export const useMapStore = defineStore('map', () => {
    const mapInstance: Ref<mapboxgl.Map | undefined> = ref();
    const mapData: Ref<MapDataObject[]> = ref([]);
    const mapMarkers: Ref<Marker[]> = ref([]);
    const mapSearchQuery: Ref<string> = ref('');
    const lockedMapObject: Ref<MapDataObject | undefined> = ref();

    function setMapData(mapDataObjects: MapDataObject[]) {
        mapData.value = mapDataObjects;
        removeAllMapMarkers();
    }

    function removeAllMapMarkers() {
        mapMarkers.value.forEach((marker: Marker) => {
            marker.remove();
        });
    }

    function toggleMapPadding(addPadding: boolean) {
        if (!mapInstance.value) {
            return;
        }

        mapInstance.value.easeTo({
            duration: 1000,
            padding: {
                top: 0,
                bottom: 0,
                left: addPadding ? 250 : 0,
                right: 0,
            },
        });
    }

    function resetStateToInitial() {
        if (mapInstance.value) {
            mapInstance.value.remove();
            mapInstance.value = undefined;
        }
        mapSearchQuery.value = '';
        lockedMapObject.value = undefined;
    }

    const filteredMapData = computed(() => {
        return mapData.value.filter((mapDataObject: MapDataObject) => {
            return mapDataObject.identifier.toLowerCase().trim().includes(mapSearchQuery.value.toLowerCase().trim());
        });
    });

    return {
        mapInstance,
        mapData,
        mapMarkers,
        mapSearchQuery,
        lockedMapObject,
        setMapData,
        removeAllMapMarkers,
        toggleMapPadding,
        resetStateToInitial,
        filteredMapData,
    };
});
