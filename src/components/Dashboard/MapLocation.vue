<template>
    <section class="mapContainer">
        <section class="customControls">
            <template v-if="fenceStore.drawHasUnsavedChanged">
                <button class="customControls-button" @click="saveFenceDrawDB">
                    <img src="@/assets/save_icon.png" alt="Button icon" height="18" width="18" />
                    Save Changes
                </button>
                <button class="customControls-button" @click="cancelFenceDrawChanges">Cancel changes</button>
            </template>
            <button v-else class="customControls-button" @click="toggleFenceDraw">
                <img v-if="fenceStore.drawDisabled" src="@/assets/show_icon.png" alt="Button icon" height="18" width="18" />
                <img v-else src="@/assets/hide_icon.png" alt="Button icon" height="18" width="18" />
                {{ fenceStore.drawDisabled ? 'Enable Fence Editor' : 'Disable Fence Editor' }}
            </button>
        </section>
        <section class="mapPlaceHolder" ref="mapPlaceHolder"></section>
    </section>
</template>

<script setup lang="ts">
import mapboxgl from 'mapbox-gl';
import MapboxDraw, { Modes } from '@mapbox/mapbox-gl-draw';
import { FeatureCollection, Feature, Polygon, MultiPolygon, Position } from 'geojson';

import { booleanPointInPolygon } from '@turf/turf';
import { saveFence, reDrawFence } from '@/socket';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import StaticMode from '@mapbox/mapbox-gl-draw-static-mode';
import type { Ref } from 'vue';
import { MapDataObject } from '@/interfaces/MapData';
import { useMapStore } from '@/stores/map';
import { useFenceStore } from '@/stores/fence';
import { onBeforeRouteLeave } from 'vue-router';

// State for map
const mapStore = useMapStore();
const fenceStore = useFenceStore();

mapboxgl.accessToken = 'pk.eyJ1IjoiaXNlbnNpb3QiLCJhIjoiY2xybmozbXEzMTQxYTJxbjE5ejMyMml6dyJ9.gsraLO-9tLQRAJYpe8qZtA';
const mapPlaceHolder: Ref<HTMLElement | null> = ref(null);
const filteredMapDataObject: Ref<MapDataObject | undefined> = ref();

const props = defineProps({
    identifier: {
        type: String,
        required: true,
    },
});

function updateTrespassingStatus(multiPolygon: MultiPolygon | undefined) {
    if (
        !fenceStore.mapBoxDraw ||
        !filteredMapDataObject.value ||
        !filteredMapDataObject.value.position ||
        !multiPolygon ||
        multiPolygon.coordinates.length === 0
    ) {
        fenceStore.isTrespassing = false;
        return;
    }

    const longLat = [filteredMapDataObject.value.position.longitude, filteredMapDataObject.value.position.latitude];
    fenceStore.isTrespassing = !booleanPointInPolygon(longLat, multiPolygon);
}

function handleMapDataUpdate(mapDataObjects: MapDataObject[]) {
    filteredMapDataObject.value = mapDataObjects.find((mapDataObject: MapDataObject) => {
        return mapDataObject.identifier == props.identifier;
    });

    if (!filteredMapDataObject.value) {
        return;
    }

    if (!mapStore.mapInstance || !filteredMapDataObject.value.position) {
        return;
    }

    // Create marker
    mapStore.lockedMapObject = filteredMapDataObject.value;
    const LngLat = new mapboxgl.LngLat(filteredMapDataObject.value.position.longitude, filteredMapDataObject.value.position.latitude);
    mapStore.mapInstance.setCenter(LngLat);

    const markerElement = document.createElement('div');
    markerElement.className = 'marker';

    const marker = new mapboxgl.Marker(markerElement, {
        scale: 0.6,
    })
        .setLngLat([filteredMapDataObject.value.position.longitude, filteredMapDataObject.value.position.latitude])
        .addTo(mapStore.mapInstance);

    // Add marker to store state
    mapStore.mapMarkers.push(marker);
}

function convertToMultiPolygon(collection: FeatureCollection) {
    const multiPolygonCoordinates: Position[][][] = collection.features
        .filter((feature: Feature) => feature.geometry.type === 'Polygon')
        .map((feature: Feature) => (feature.geometry as Polygon).coordinates);

    const multiPolygonFeature: Feature<MultiPolygon> = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'MultiPolygon',
            coordinates: multiPolygonCoordinates,
        },
    };

    return multiPolygonFeature.geometry;
}

function saveFenceDrawLocally() {
    if (!fenceStore.mapBoxDraw) {
        return;
    }

    const collection: FeatureCollection = fenceStore.mapBoxDraw.getAll();
    const multiPolygon: MultiPolygon = convertToMultiPolygon(collection);

    fenceStore.drawLocal = multiPolygon;
    fenceStore.drawHasUnsavedChanged = true;
}

function saveFenceDrawDB() {
    if (!fenceStore.drawLocal) {
        return;
    }

    saveFence(props.identifier, fenceStore.drawLocal);
    fenceStore.drawHasUnsavedChanged = false;
}

function cancelFenceDrawChanges() {
    if (!fenceStore.mapBoxDraw) {
        return;
    }

    fenceStore.addPolygonsToInstance(fenceStore.drawDB);
    fenceStore.drawLocal = fenceStore.drawDB;
    fenceStore.drawHasUnsavedChanged = false;
}

function toggleFenceDraw() {
    if (!fenceStore.mapBoxDraw) {
        return;
    }

    if (fenceStore.mapBoxDraw.getMode() == 'static') {
        fenceStore.mapBoxDraw.changeMode('simple_select');
        showDrawControls(true);
        fenceStore.drawDisabled = false;
    } else {
        fenceStore.mapBoxDraw.changeMode('static');
        showDrawControls(false);
        fenceStore.drawDisabled = true;
    }
}

function showDrawControls(show: boolean) {
    const controls = Array.from(document.getElementsByClassName('mapboxgl-ctrl-group')) as HTMLElement[];

    if (controls.length === 0) {
        return;
    }
    if (show) {
        controls[0].style.display = 'initial';
    } else {
        controls[0].style.display = 'none';
    }
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

    const modes = MapboxDraw.modes;
    modes.static = StaticMode;

    fenceStore.mapBoxDraw = new MapboxDraw({
        modes: modes,
        displayControlsDefault: false,
        controls: {
            polygon: true,
            trash: true,
        },
        defaultMode: 'static',
        userProperties: true,
        styles: [
            {
                id: 'gl-draw-polygon-fill-inactive',
                type: 'fill',
                filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
                paint: {
                    'fill-color': '#3bb2d0',
                    'fill-outline-color': '#3bb2d0',
                    'fill-opacity': 0.1,
                },
            },
            {
                id: 'gl-draw-polygon-fill-active',
                type: 'fill',
                filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
                paint: {
                    'fill-color': '#fbb03b',
                    'fill-outline-color': '#fbb03b',
                    'fill-opacity': 0.1,
                },
            },
            {
                id: 'gl-draw-polygon-midpoint',
                type: 'circle',
                filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
                paint: {
                    'circle-radius': 3,
                    'circle-color': '#fbb03b',
                },
            },
            {
                id: 'gl-draw-polygon-stroke-inactive',
                type: 'line',
                filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                paint: {
                    'line-color': '#3bb2d0',
                    'line-width': 2,
                },
            },
            {
                id: 'gl-draw-polygon-stroke-active',
                type: 'line',
                filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                paint: {
                    'line-color': '#fbb03b',
                    'line-dasharray': [0.2, 2],
                    'line-width': 2,
                },
            },
            {
                id: 'gl-draw-line-inactive',
                type: 'line',
                filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                paint: {
                    'line-color': '#3bb2d0',
                    'line-width': 2,
                },
            },
            {
                id: 'gl-draw-line-active',
                type: 'line',
                filter: ['all', ['==', '$type', 'LineString'], ['==', 'active', 'true']],
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                paint: {
                    'line-color': '#fbb03b',
                    'line-dasharray': [0.2, 2],
                    'line-width': 2,
                },
            },
            {
                id: 'gl-draw-polygon-and-line-vertex-stroke-inactive',
                type: 'circle',
                filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
                paint: {
                    'circle-radius': 5,
                    'circle-color': '#fff',
                },
            },
            {
                id: 'gl-draw-polygon-and-line-vertex-inactive',
                type: 'circle',
                filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
                paint: {
                    'circle-radius': 3,
                    'circle-color': '#fbb03b',
                },
            },
            {
                id: 'gl-draw-point-point-stroke-inactive',
                type: 'circle',
                filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Point'], ['==', 'meta', 'feature'], ['!=', 'mode', 'static']],
                paint: {
                    'circle-radius': 5,
                    'circle-opacity': 1,
                    'circle-color': '#fff',
                },
            },
            {
                id: 'gl-draw-point-inactive',
                type: 'circle',
                filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Point'], ['==', 'meta', 'feature'], ['!=', 'mode', 'static']],
                paint: {
                    'circle-radius': 3,
                    'circle-color': '#3bb2d0',
                },
            },
            {
                id: 'gl-draw-point-stroke-active',
                type: 'circle',
                filter: ['all', ['==', '$type', 'Point'], ['==', 'active', 'true'], ['!=', 'meta', 'midpoint']],
                paint: {
                    'circle-radius': 7,
                    'circle-color': '#fff',
                },
            },
            {
                id: 'gl-draw-point-active',
                type: 'circle',
                filter: ['all', ['==', '$type', 'Point'], ['!=', 'meta', 'midpoint'], ['==', 'active', 'true']],
                paint: {
                    'circle-radius': 5,
                    'circle-color': '#fbb03b',
                },
            },
            {
                id: 'gl-draw-polygon-fill-static',
                type: 'fill',
                filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
                paint: {
                    'fill-color': '#00FF00',
                    'fill-outline-color': '#00FF00',
                    'fill-opacity': 0.15,
                },
            },
            {
                id: 'gl-draw-polygon-stroke-static',
                type: 'line',
                filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                paint: {
                    'line-color': '#404040',
                    'line-width': 2,
                },
            },
            {
                id: 'gl-draw-line-static',
                type: 'line',
                filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'LineString']],
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                paint: {
                    'line-color': '#404040',
                    'line-width': 2,
                },
            },
            {
                id: 'gl-draw-point-static',
                type: 'circle',
                filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Point']],
                paint: {
                    'circle-radius': 5,
                    'circle-color': '#404040',
                },
            },
        ],
    });

    map.addControl(fenceStore.mapBoxDraw);

    // Add controls to map
    map.addControl(
        new mapboxgl.NavigationControl({
            visualizePitch: true,
        })
    );

    map.on('load', function () {
        reDrawFence(props.identifier);
        map.on('draw.create', saveFenceDrawLocally);
        map.on('draw.delete', saveFenceDrawLocally);
        map.on('draw.update', saveFenceDrawLocally);
    });

    mapStore.mapInstance = map;
    showDrawControls(false);

    watch(
        () => fenceStore.drawLocal,
        (multiPolygon) => {
            updateTrespassingStatus(multiPolygon);
        }
    );

    watch(
        () => mapStore.mapData,
        (mapDataObjects: MapDataObject[]) => {
            handleMapDataUpdate(mapDataObjects);
        },
        { immediate: true }
    );
});

onUnmounted(() => {
    mapStore.resetStateToInitial();
    fenceStore.resetStateToInitial();
});
</script>

<style scoped lang="scss">
.mapContainer {
    position: relative;
    height: 100%;
    width: 100%;

    .customControls {
        position: absolute;
        margin: 10px 0 0 10px;
        display: flex;
        gap: 10px;
        z-index: 999;
    }

    .customControls-button {
        border: 2px solid #007afb;
        border-radius: 8px;
        padding: 8px;
        font-size: 13px;
        cursor: pointer;

        background-color: #007afb;
        color: white;
        transition: 0.3s;

        display: flex;
        align-items: center;
        gap: 8px;
        transition: 0.15s;
        &:hover {
            background-color: #006ee2;
        }
    }

    .mapPlaceHolder {
        height: 100%;
        width: 100%;
    }
}
</style>
