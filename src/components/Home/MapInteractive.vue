<template>
  <section class="mapContainer">
    <MapVehicles></MapVehicles>
    <span @click="sideBarStore.toggleSidebar"
      >Press <b>Escape</b> to
      {{ sideBarStore.isOpen ? "close" : "open" }} sidemenu</span
    >
    <section class="mapPlaceHolder" ref="mapPlaceHolder"></section>
  </section>
</template>

<script setup lang="ts">
import mapboxgl from "mapbox-gl";
import { useSideBarStore } from "@/stores/sidebar";
import { onMounted, onUnmounted, ref, watch } from "vue";
import type { Ref } from "vue";
import MapVehicles from "@/components/Home/MapVehicles.vue";

const sideBarStore = useSideBarStore();
mapboxgl.accessToken =
  "pk.eyJ1IjoiaXNlbnNpb3QiLCJhIjoiY2xxMzNyeno0MDhhMDJqbzRyc3Z0NnN2cCJ9.8X6v6K23BdJpsN_1-J9Ccg";
const mapPlaceHolder: Ref<HTMLElement | null> = ref(null);
const mapInstance: Ref<mapboxgl.Map | undefined> = ref();

watch(
  () => sideBarStore.isOpen,
  () => {
    animateMap();
  }
);

function animateMap() {
  if (mapInstance.value) {
    mapInstance.value.easeTo({
      duration: 1000,
      padding: {
        top: 0,
        bottom: 0,
        left: sideBarStore.isOpen ? 300 : 0,
        right: 0,
      },
    });
  }
}

function handleKeyRelease(event: KeyboardEvent) {
  if (event.code == "Escape") {
    sideBarStore.toggleSidebar();
  }
}

onMounted(() => {
  if (mapPlaceHolder.value) {
    // Create mapboxgl map
    const map = new mapboxgl.Map({
      container: mapPlaceHolder.value,
      style: "mapbox://styles/isensiot/clq3qs9my01ye01p980krh970",
      center: [4.488068583333333, 52.15482278333333],
      zoom: 15,
      minZoom: 7,
      attributionControl: false,
      logoPosition: "bottom-right",
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
          left: 300,
          right: 0,
        },
      });
    }

    window.addEventListener("keyup", handleKeyRelease);
    mapInstance.value = map;
  }
});

onUnmounted(() => {
  window.removeEventListener("keyup", handleKeyRelease);
  sideBarStore.resetStateToInitial();
  if (mapInstance.value) {
    mapInstance.value.remove();
    mapInstance.value = undefined;
  }
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
