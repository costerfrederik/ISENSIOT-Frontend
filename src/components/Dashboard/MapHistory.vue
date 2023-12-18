<template>
  <section class="mapContainer">
    <section class="mapPlaceHolder" ref="mapPlaceHolder"></section>
  </section>
</template>

<script setup lang="ts">
import mapboxgl from "mapbox-gl";
import { onMounted, onUnmounted, ref, watch } from "vue";
import type { Ref } from "vue";
import { MapDataObject } from "@/interfaces/MapData";
import { useMapHistoryStore } from "@/stores/mapHistory";
import { useRoute } from "vue-router";
const route = useRoute();

const mapHistoryStore = useMapHistoryStore();
mapboxgl.accessToken =
  "pk.eyJ1IjoiaXNlbnNpb3QiLCJhIjoiY2xxMzNyeno0MDhhMDJqbzRyc3Z0NnN2cCJ9.8X6v6K23BdJpsN_1-J9Ccg";
const mapPlaceHolder: Ref<HTMLElement | null> = ref(null);

function addMarkersToMap(mapDataObjects: MapDataObject[]) {
  mapDataObjects.forEach((mapDataObject: MapDataObject) => {
    if (!mapHistoryStore.mapInstance || !mapDataObject.position) {
      return;
    }

    // Create marker
    const markerElement = document.createElement("div");
    markerElement.className = "marker";

    // Create marker
    const marker = new mapboxgl.Marker(markerElement, {
      scale: 0.6,
    })
      .setLngLat([
        mapDataObject.position.longitude,
        mapDataObject.position.latitude,
      ])
      .addTo(mapHistoryStore.mapInstance);

    // Add all markers to store state
    mapHistoryStore.mapMarkers.push(marker);
  });
}

onMounted(async () => {
  if (!mapPlaceHolder.value) {
    return;
  }

  // Create mapboxgl map
  const map = new mapboxgl.Map({
    container: mapPlaceHolder.value,
    style: "mapbox://styles/isensiot/clq3qs9my01ye01p980krh970",
    center: [5.2793703, 52.2129919],
    zoom: 7,
    scrollZoom: false,
    boxZoom: false,
    doubleClickZoom: false,
    dragPan: false,
    dragRotate: false,
    attributionControl: false,
    logoPosition: "bottom-right",
  });

  // Add controls to map
  map.addControl(
    new mapboxgl.NavigationControl({
      visualizePitch: true,
    })
  );

  mapHistoryStore.mapInstance = map;
  const mapIdentifier = route.params.identifier;
  if (mapIdentifier) {
    mapHistoryStore.mapIdentifier = mapIdentifier.toString();
  }
  // watch(
  //   () => mapHistoryStore.mapData,
  //   (mapDataObjects: MapDataObject[]) => {
  //     addMarkersToMap(mapDataObjects);
  //   },
  //   { immediate: true }
  // );
});

onUnmounted(() => {
  mapHistoryStore.resetStateToInitial();
});
</script>

<style scoped lang="scss">
.mapContainer {
  position: relative;
  height: 50vh;

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
