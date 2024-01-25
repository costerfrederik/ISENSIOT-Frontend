<template>
    <section class="mapContainer">
        <button class="toggleEditing" @click="toggleFenceDraw">
            <img v-if="drawDisabled" class="toggleEditing_icon" src="@/assets/show_icon.png" alt="View locked icon" height="18" width="18" />
            <img v-else class="toggleEditing_icon" src="@/assets/hide_icon.png" alt="View locked icon" height="18" width="18" />
            {{ drawDisabled ? 'Enable Fence Editor' : 'Disable Fence Editor' }}
        </button>
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

const mapStore = useMapStore();
mapboxgl.accessToken = 'pk.eyJ1IjoiaXNlbnNpb3QiLCJhIjoiY2xybmozbXEzMTQxYTJxbjE5ejMyMml6dyJ9.gsraLO-9tLQRAJYpe8qZtA';
const mapPlaceHolder: Ref<HTMLElement | null> = ref(null);
const filteredMapDataObject: Ref<MapDataObject | undefined> = ref();
const drawDisabled: Ref<boolean> = ref(true);

const props = defineProps({
    identifier: {
        type: String,
        required: true,
    },
});

function updateTrespassingStatus(multiPolygon: MultiPolygon) {
    if (
        !mapStore.draw ||
        !filteredMapDataObject.value ||
        !filteredMapDataObject.value.position ||
        !multiPolygon ||
        multiPolygon.coordinates.length === 0
    ) {
        mapStore.isTrespassing = false;
        return;
    }

    const longLat = [filteredMapDataObject.value.position.longitude, filteredMapDataObject.value.position.latitude];
    mapStore.isTrespassing = !booleanPointInPolygon(longLat, multiPolygon);
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

function handleFenceDraw() {
    if (!mapStore.draw) {
        return;
    }

    const collection: FeatureCollection = mapStore.draw.getAll();
    const multiPolygon = convertToMultiPolygon(collection);

    updateTrespassingStatus(multiPolygon);
    saveFence(props.identifier, multiPolygon);
}

function toggleFenceDraw() {
    if (!mapStore.draw) {
        return;
    }

    if (mapStore.draw.getMode() == 'static') {
        mapStore.draw.changeMode('simple_select');
        showDrawControls(true);
        drawDisabled.value = false;
    } else {
        mapStore.draw.changeMode('static');
        showDrawControls(false);
        drawDisabled.value = true;
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

    mapStore.draw = new MapboxDraw({
        modes: modes,
        displayControlsDefault: false,
        controls: {
            polygon: true,
            trash: true,
        },
        defaultMode: 'static',
    });

    map.addControl(mapStore.draw);

    // Add controls to map
    map.addControl(
        new mapboxgl.NavigationControl({
            visualizePitch: true,
        })
    );

    map.on('load', function () {
        reDrawFence(props.identifier);
        map.on('draw.create', handleFenceDraw);
        map.on('draw.delete', handleFenceDraw);
        map.on('draw.update', handleFenceDraw);
    });

    mapStore.mapInstance = map;
    showDrawControls(false);

    watch(
        () => mapStore.multiPolygon,
        (multiPolygon) => {
            if (multiPolygon) {
                updateTrespassingStatus(multiPolygon);
            }
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
});
</script>

<style scoped lang="scss">
.mapContainer {
    position: relative;
    height: 100%;
    width: 100%;

    .toggleEditing {
        border: 2px solid #007afb;
        border-radius: 8px;
        padding: 8px;
        font-size: 13px;
        cursor: pointer;

        background-color: #007afb;
        color: white;
        margin: 10px 0 0 10px;
        position: absolute;
        z-index: 999;
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
