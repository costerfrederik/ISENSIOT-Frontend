<template>
    <section class="mapContainer">
        <MapVehicles @onSelect="handleOnLock"></MapVehicles>
        <span @click="sideBarStore.toggleSidebar">Press <b>Escape</b> to {{ sideBarStore.isOpen ? 'close' : 'open' }} sidemenu</span>
        <section class="mapPlaceHolder" ref="mapPlaceHolder"></section>
    </section>
</template>

<script setup lang="ts">
import mapboxgl from 'mapbox-gl';
import { useSideBarStore } from '@/stores/sidebar';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { Ref } from 'vue';
import MapVehicles from '@/components/Home/MapVehicles.vue';
import { MapDataObject } from '@/interfaces/MapData';
import { useMapStore } from '@/stores/map';

const sideBarStore = useSideBarStore();
const mapStore = useMapStore();
mapboxgl.accessToken = 'pk.eyJ1IjoiaXNlbnNpb3QiLCJhIjoiY2xxMzNyeno0MDhhMDJqbzRyc3Z0NnN2cCJ9.8X6v6K23BdJpsN_1-J9Ccg';
const mapPlaceHolder: Ref<HTMLElement | null> = ref(null);

function handleKeyRelease(event: KeyboardEvent) {
    if (event.code == 'Escape') {
        sideBarStore.toggleSidebar();
    }
}

function handleOnLock(lockedMapObject: MapDataObject | undefined) {
    if (!mapStore.mapInstance) {
        return;
    }
    if (lockedMapObject == undefined) {
        mapStore.mapInstance.stop();
        return;
    }
    if (!lockedMapObject.position) {
        return;
    }

    mapStore.mapInstance.flyTo({
        center: [lockedMapObject.position.longitude, lockedMapObject.position.latitude],
        zoom: 17,
        speed: 0.9,
        essential: true,
    });
}

function addMarkersToMap(mapDataObjects: MapDataObject[]) {
    mapDataObjects.forEach((mapDataObject: MapDataObject) => {
        if (!mapStore.mapInstance || !mapDataObject.position) {
            return;
        }

        const markerElement = document.createElement('div');
        markerElement.className = 'marker';

        markerElement.addEventListener('click', () => {
            handleOnLock(mapDataObject);
        });

        const marker = new mapboxgl.Marker(markerElement, {
            scale: 0.6,
        })
            .setLngLat([mapDataObject.position.longitude, mapDataObject.position.latitude])
            .addTo(mapStore.mapInstance);
        mapStore.mapMarkers.push(marker);
    });
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
        zoom: 7,
        attributionControl: false,
        logoPosition: 'bottom-right',
    });

    // Add controls to map
    map.addControl(
        new mapboxgl.NavigationControl({
            visualizePitch: true,
        })
    );

    // Add padding to map if sidebar is open
    if (sideBarStore.isOpen) {
        map.jumpTo({
            padding: {
                top: 0,
                bottom: 0,
                left: 250,
                right: 0,
            },
        });
    }

    mapStore.mapInstance = map;
    window.addEventListener('keyup', handleKeyRelease);

    watch(
        () => mapStore.mapData,
        (mapDataObjects: MapDataObject[]) => {
            addMarkersToMap(mapDataObjects);
        },
        { immediate: true }
    );
});

onUnmounted(() => {
    window.removeEventListener('keyup', handleKeyRelease);
    sideBarStore.resetStateToInitial();
    mapStore.resetStateToInitial();
});
</script>

<style scoped lang="scss">
.mapContainer {
    position: relative;
    height: calc(100vh - 70px);
    width: 100%;

    .mapPlaceHolder {
        position: absolute;
        height: 100%;
        width: 100%;
    }

    span {
        font-size: 12px;
        position: absolute;
        color: white;
        z-index: 10000;
        bottom: 12px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(18, 18, 23, 0.9);
        border-radius: 8px;
        padding: 8px 12px;
        cursor: pointer;
        transition: 0.3s;
        user-select: none; /* Standard syntax */
        &:hover {
            background-color: #007afb;
        }
    }
}
</style>
