<template>
    <section class="mapContainer">
        <section class="mapPlaceHolder" ref="mapPlaceHolder"></section>
    </section>
</template>

<script setup lang="ts">
import mapboxgl from 'mapbox-gl';
import { mergeProps, onMounted, onUnmounted, ref, watch } from 'vue';
import type { Ref } from 'vue';
import { MapDataObject } from '@/interfaces/MapData';
import { useMapStore } from '@/stores/map';

const mapStore = useMapStore();
mapboxgl.accessToken = 'pk.eyJ1IjoiaXNlbnNpb3QiLCJhIjoiY2xxMzNyeno0MDhhMDJqbzRyc3Z0NnN2cCJ9.8X6v6K23BdJpsN_1-J9Ccg';
const mapPlaceHolder: Ref<HTMLElement | null> = ref(null);

const props = defineProps({
    identifier: {
        type: String,
        required: true,
    },
});

function addMarkerToMap(mapDataObjects: MapDataObject[]) {
    const filteredMapDataObject = mapDataObjects.find((mapDataObject: MapDataObject) => {
        return mapDataObject.identifier == props.identifier;
    });

    if (!filteredMapDataObject) {
        return;
    }

    if (!mapStore.mapInstance || !filteredMapDataObject.position) {
        return;
    }

    mapStore.lockedMapObject = filteredMapDataObject;
    const LngLat = new mapboxgl.LngLat(filteredMapDataObject.position.longitude, filteredMapDataObject.position.latitude);
    mapStore.mapInstance.setCenter(LngLat);

    // Create marker
    const markerElement = document.createElement('div');
    markerElement.className = 'marker';

    // Create marker
    const marker = new mapboxgl.Marker(markerElement, {
        scale: 0.6,
    })
        .setLngLat([filteredMapDataObject.position.longitude, filteredMapDataObject.position.latitude])
        .addTo(mapStore.mapInstance);

    // Add marker to store state
    mapStore.mapMarkers.push(marker);
}

onMounted(async () => {
    if (!mapPlaceHolder.value) {
        return;
    }

    // Create mapboxgl map
    const map = new mapboxgl.Map({
        container: mapPlaceHolder.value,
        style: 'mapbox://styles/isensiot/clq3qs9my01ye01p980krh970',
        center: [5.2793703, 52.2129919],
        zoom: 17,
        minZoom: 10,
        attributionControl: false,
        logoPosition: 'bottom-right',
    });

    // Add controls to map
    map.addControl(
        new mapboxgl.NavigationControl({
            visualizePitch: true,
        })
    );

    mapStore.mapInstance = map;

    watch(
        () => mapStore.mapData,
        (mapDataObjects: MapDataObject[]) => {
            addMarkerToMap(mapDataObjects);
        },
        { immediate: true }
    );
});

onUnmounted(() => {
    mapStore.resetStateToInitial();
});
</script>

<style scoped lang="scss">
.mapContainer {
    position: relative;
    height: 100%;

    .mapPlaceHolder {
        position: absolute;
        height: 100%;
        width: 100%;
    }

    div {
        position: absolute;
        z-index: 10000;
        bottom: 12px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 5px;
    }

    .map__link {
        font-size: 12px;
        color: white;
        background-color: rgba(18, 18, 23, 0.9);
        border-radius: 8px;
        padding: 8px 12px;
        transition: 0.3s;
        user-select: none; /* Standard syntax */
        text-align: center;
        &:not(.link--disabled) {
            &:hover {
                background-color: #007afb;
                cursor: pointer;
            }
        }
    }
}
</style>
