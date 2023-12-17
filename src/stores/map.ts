import mapboxgl, { Marker } from 'mapbox-gl';
import { defineStore } from 'pinia';
import { MapDataObject } from '@/interfaces/MapData';
import { computed } from 'vue';
import { ref, watch } from 'vue';
import type { Ref } from 'vue';

export const useMapStore = defineStore('map', () => {
    const mapInstance: Ref<mapboxgl.Map | undefined> = ref();
    const mapData: Ref<MapDataObject[]> = ref([]);
    const mapMarkers: Ref<Marker[]> = ref([]);
    const mapSearchQuery: Ref<string> = ref('');
    const lockedMapObject: Ref<MapDataObject | undefined> = ref();

    // Watcher that calls method when lockedMapObject changes
    watch(lockedMapObject, onMapObjectLock);

    // Method that sets map data, and removes all markers
    function setMapData(mapDataObjects: MapDataObject[]) {
        mapData.value = mapDataObjects;

        if (lockedMapObject.value) {
            const newLockedMapObject = mapDataObjects.find((mapDataObject) => {
                return mapDataObject.identifier == lockedMapObject.value?.identifier;
            });

            if (!newLockedMapObject || !newLockedMapObject.position) {
                lockedMapObject.value = undefined;
            } else {
                lockedMapObject.value = newLockedMapObject;
            }
        }

        removeAllMapMarkers();
        centerLockedMapObject();
    }

    // Method that zooms into locked map object
    function onMapObjectLock() {
        if (!mapInstance.value) {
            return;
        }

        // Add active border to marker if object in lockedMapObject
        mapMarkers.value.forEach((marker: Marker) => {
            const lockedLatitude = lockedMapObject.value?.position?.latitude;
            const lockedLongitude = lockedMapObject.value?.position?.longitude;
            if (marker.getLngLat().lat == lockedLatitude && marker.getLngLat().lng == lockedLongitude) {
                marker.getElement().classList.add('marker--active');
            } else {
                marker.getElement().classList.remove('marker--active');
            }
        });

        if (!lockedMapObject.value) {
            mapInstance.value.stop();
            return;
        }

        if (!lockedMapObject.value.position) {
            return;
        }

        mapInstance.value.flyTo({
            center: [lockedMapObject.value.position.longitude, lockedMapObject.value.position.latitude],
            zoom: 15,
            speed: 0.9,
            essential: true,
        });
    }

    // Method that set's center of map
    function centerLockedMapObject() {
        mapData.value.forEach((mapDataObject: MapDataObject) => {
            if (!mapInstance.value || !mapDataObject.position || !lockedMapObject.value || !lockedMapObject.value.position) {
                return;
            }

            if (mapDataObject.position.id == lockedMapObject.value.position.id || mapDataObject.identifier !== lockedMapObject.value.identifier) {
                return;
            }

            const currentLatitude = mapDataObject.position.latitude;
            const currentLongitude = mapDataObject.position.longitude;
            const lockedLatitude = lockedMapObject.value.position.latitude;
            const lockedLongitude = lockedMapObject.value.position.longitude;

            if (currentLatitude == lockedLatitude && currentLongitude == lockedLongitude) {
                return;
            }

            mapInstance.value.flyTo({
                center: [currentLongitude, currentLatitude],
                zoom: 15,
                speed: 0.9,
                duration: 2500,
                essential: true,
            });
        });
    }

    // Method that removes all markers from map
    function removeAllMapMarkers() {
        mapMarkers.value.forEach((marker: Marker) => {
            marker.remove();
        });
    }

    // Method that adds padding to map instance (for sidebar)
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

    // Resets all store state to initial values
    function resetStateToInitial() {
        if (mapInstance.value) {
            mapInstance.value.remove();
            mapInstance.value = undefined;
        }
        mapMarkers.value = [];
        mapSearchQuery.value = '';
        lockedMapObject.value = undefined;
    }

    // Filters map data based on map search query
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
