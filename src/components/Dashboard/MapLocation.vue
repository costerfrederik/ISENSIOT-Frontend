<template>
    <section class="mapContainer">
        <section class="mapPlaceHolder" ref="mapPlaceHolder"></section>
    </section>
</template>

<script setup lang="ts">
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { FeatureCollection, Feature, Polygon, MultiPolygon, Position, Point } from 'geojson';
import { point, booleanPointInPolygon, multiPolygon } from '@turf/turf';
import { updateFence } from '@/socket';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { Ref } from 'vue';
import { MapDataObject } from '@/interfaces/MapData';
import { useMapStore } from '@/stores/map';

const mapStore = useMapStore();
mapboxgl.accessToken = 'pk.eyJ1IjoiaXNlbnNpb3QiLCJhIjoiY2xybmozbXEzMTQxYTJxbjE5ejMyMml6dyJ9.gsraLO-9tLQRAJYpe8qZtA';
const mapPlaceHolder: Ref<HTMLElement | null> = ref(null);
const draw: Ref<MapboxDraw | null> = ref(null);

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

    // Calculate if mapDataObject is trespassing a fence
    const longLat = [filteredMapDataObject.position.longitude, filteredMapDataObject.position.latitude];
    // const isTrespassing = isTrespassingFence(longLat);

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

function getMultiPolygonCoordinates(collection: FeatureCollection) {
    const multiPolygonCoordinates: Position[][][] = collection.features
        .filter((feature: Feature) => feature.geometry.type === 'Polygon')
        .map((feature: Feature) => (feature.geometry as Polygon).coordinates);
    return multiPolygonCoordinates;
}

function convertToMultiPolygon(multiPolygonCoordinates: Position[][][]) {
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

// Method should insert draw area into database
function updateFenceArea() {
    if (!draw.value) {
        return;
    }

    const collection: FeatureCollection = draw.value.getAll();
    const multiPolygonCoordinates = getMultiPolygonCoordinates(collection);

    // Insert drawn fence into database
    updateFence(props.identifier, multiPolygonCoordinates);

    // const multiPolygon = convertToMultiPolygon(multiPolygonCoordinates);

    // if (!multiPolygon) {
    //     return;
    // }

    // console.log(multiPolygon);

    // Insert multiPolygon into database

    // const inside = booleanPointInPolygon(pt, multiPolygon);
    // console.log(inside);
}

// function isTrespassingFence(longLat: number[]) {
//     if (!draw.value) {
//         return;
//     }

//     const collection: FeatureCollection = draw.value.getAll();
//     const multiPolygon = convertToMultiPolygon(collection);

//     if (!multiPolygon) {
//         return;
//     }

//     const inside = booleanPointInPolygon(pt, multiPolygon);
//     console.log(inside);
// }

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

    draw.value = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
            polygon: true,
            trash: true,
        },
        defaultMode: 'draw_polygon',
    });

    map.addControl(draw.value);

    map.on('draw.create', updateFenceArea);
    map.on('draw.delete', updateFenceArea);
    map.on('draw.update', updateFenceArea);

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
