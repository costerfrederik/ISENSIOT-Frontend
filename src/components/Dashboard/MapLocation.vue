<template>
    <section class="mapContainer">
        <section class="mapPlaceHolder" ref="mapPlaceHolder"></section>
    </section>
</template>

<script setup lang="ts">
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { FeatureCollection, Feature, Polygon, MultiPolygon, Position } from 'geojson';
import { booleanPointInPolygon } from '@turf/turf';
import { saveFence, reDrawFence } from '@/socket';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { Ref } from 'vue';
import { MapDataObject } from '@/interfaces/MapData';
import { useMapStore } from '@/stores/map';

const mapStore = useMapStore();
mapboxgl.accessToken = 'pk.eyJ1IjoiaXNlbnNpb3QiLCJhIjoiY2xybmozbXEzMTQxYTJxbjE5ejMyMml6dyJ9.gsraLO-9tLQRAJYpe8qZtA';
const mapPlaceHolder: Ref<HTMLElement | null> = ref(null);

const props = defineProps({
    identifier: {
        type: String,
        required: true,
    },
});

function handleMapDataUpdate(mapDataObjects: MapDataObject[]) {
    const filteredMapDataObject = mapDataObjects.find((mapDataObject: MapDataObject) => {
        return mapDataObject.identifier == props.identifier;
    });

    if (!filteredMapDataObject) {
        return;
    }

    if (!mapStore.mapInstance || !filteredMapDataObject.position) {
        return;
    }

    // Create marker
    mapStore.lockedMapObject = filteredMapDataObject;
    const LngLat = new mapboxgl.LngLat(filteredMapDataObject.position.longitude, filteredMapDataObject.position.latitude);
    mapStore.mapInstance.setCenter(LngLat);

    const markerElement = document.createElement('div');
    markerElement.className = 'marker';

    const marker = new mapboxgl.Marker(markerElement, {
        scale: 0.6,
    })
        .setLngLat([filteredMapDataObject.position.longitude, filteredMapDataObject.position.latitude])
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
    saveFence(props.identifier, multiPolygon);
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

    mapStore.draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
            polygon: true,
            trash: true,
        },
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
    height: 100%;
    width: 100%;

    .mapPlaceHolder {
        height: 100%;
        width: 100%;
    }
}
</style>
