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
mapboxgl.accessToken = 'pk.eyJ1IjoiaXNlbnNpb3QiLCJhIjoiY2xybmoyb2F5MDUyZTJqc2U3MDF0M3pwNCJ9.U5Uwd-NxCbAcSzZ4W62ZvQ';
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
    height: 100%;
    width: 100%;

    .mapPlaceHolder {
        height: 100%;
        width: 100%;
    }
}
</style>
