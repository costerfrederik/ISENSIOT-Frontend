<template>
    <section class="mapContainer">
        <MapVehicles></MapVehicles>
        <div>
            <span class="map__link" @click="sideBarStore.toggleSidebar"
                >Press <b>Escape</b> to {{ sideBarStore.isOpen ? 'close' : 'open' }} sidemenu</span
            >
            <span class="map__link link--disabled"
                >Mode: <b>{{ mapStore.lockedMapObject ? 'Follow' : 'Free Roam' }}</b></span
            >
        </div>
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
import router from '@/router';

const sideBarStore = useSideBarStore();
const mapStore = useMapStore();
mapboxgl.accessToken = 'pk.eyJ1IjoiaXNlbnNpb3QiLCJhIjoiY2xydXZrcGRsMG9rOTJrbG1wemV5bG85cyJ9.7mq0gqg-bRiD5GOYJP1XNQ';
const mapPlaceHolder: Ref<HTMLElement | null> = ref(null);

function handleKeyRelease(event: KeyboardEvent) {
    if (event.code == 'Escape') {
        sideBarStore.toggleSidebar();
    }
}

function addMarkersToMap(mapDataObjects: MapDataObject[]) {
    mapDataObjects.forEach((mapDataObject: MapDataObject) => {
        if (!mapStore.mapInstance || !mapDataObject.position) {
            return;
        }

        // Create popup element
        const popupElement = document.createElement('div');
        const titleElement = document.createElement('h3');
        const speedElement = document.createElement('span');
        const buttonElement = document.createElement('button');
        popupElement.className = 'popup-inner';
        titleElement.textContent = mapDataObject.identifier;
        speedElement.textContent = `GPS speed: ${mapDataObject.position.speed} km/h`;
        buttonElement.textContent = 'Dashboard';
        popupElement.appendChild(titleElement);
        popupElement.appendChild(speedElement);
        popupElement.appendChild(buttonElement);

        buttonElement.addEventListener('click', (e) => {
            e.preventDefault();
            router.push(`/dashboard/${mapDataObject.identifier}`);
        });

        // Create new popup based on element
        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false, focusAfterOpen: false }).setDOMContent(popupElement);

        // Create marker
        const markerElement = document.createElement('div');
        markerElement.className = 'marker';

        // Create marker and link popup with marker
        const marker = new mapboxgl.Marker(markerElement, {
            scale: 0.6,
        })
            .setLngLat([mapDataObject.position.longitude, mapDataObject.position.latitude])
            .setPopup(popup)
            .addTo(mapStore.mapInstance);

        // Add all markers to store state
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
