<template>
    <section class="overview__list" :class="{ 'list--collapsed': !sideBarStore.isOpen }">
        <section class="list__filter">
            <h4>Filter</h4>
            <input
                class="filter__searchbox"
                v-model="mapStore.mapSearchQuery"
                type="text"
                name="searchbox"
                placeholder="Search Vehicles by identifier"
            />
            <h4 class="filter__title">Your vehicles</h4>
        </section>
        <VehicleResult
            v-if="vehiclesLoading"
            icon-name="time_icon.png"
            identifier="Loading your vehicles"
            last-position="Your linked vehicles are being loaded in."
            :disabled="true"
        ></VehicleResult>
        <VehicleResult
            v-else-if="!mapStore.mapData || !mapStore.mapData.length"
            icon-name="notlinked_icon.png"
            identifier="No vehicles linked"
            last-position="Linked vehicles will be shown here. But you have none."
            :disabled="true"
        ></VehicleResult>
        <VehicleResult
            v-else-if="!mapStore.filteredMapData.length"
            icon-name="notfound_icon.png"
            identifier="No vehicles found"
            last-position="Your search query did not have any results."
            :disabled="true"
        ></VehicleResult>
        <template v-else>
            <VehicleResult
                v-for="mapObject in mapStore.filteredMapData"
                v-bind:key="mapObject.identifier"
                :icon-name="mapObject.position ? 'taxi_icon.png' : 'warning_icon.png'"
                :identifier="mapObject.identifier"
                :last-position="lastPositionFormatted(mapObject.position)"
                @onSelect="handleOnSelect(mapObject)"
                :active="mapObject.identifier == mapStore.lockedMapObject?.identifier"
            ></VehicleResult>
        </template>
    </section>
</template>

<script setup lang="ts">
import VehicleResult from '@/components/Home/VehicleResult.vue';
import { onMounted, ref, watch } from 'vue';
import { Position, MapDataObject } from '@/interfaces/MapData';
import { useSideBarStore } from '@/stores/sidebar';
import { useMapStore } from '@/stores/map';
const sideBarStore = useSideBarStore();
const mapStore = useMapStore();

const vehiclesLoading = ref(true);
const emit = defineEmits(['onSelect']);

function handleOnSelect(mapObject: MapDataObject) {
    if (!mapStore.lockedMapObject) {
        mapStore.lockedMapObject = mapObject;
        return;
    }

    if (mapStore.lockedMapObject.identifier == mapObject.identifier) {
        mapStore.lockedMapObject = undefined;
        return;
    }

    mapStore.lockedMapObject = mapObject;
}

function lastPositionFormatted(position: Position | undefined) {
    if (!position) {
        return 'Last position: Never';
    }
    const datetime = new Date(position.datetime).toLocaleString('nl-nl');
    return `Last position: ${datetime}`;
}

watch(
    () => sideBarStore.isOpen,
    (newValue) => {
        mapStore.toggleMapPadding(newValue);
    }
);

onMounted(() => {
    setTimeout(() => {
        vehiclesLoading.value = false;
    }, 2000);
});
</script>

<style scoped lang="scss">
.overview__list {
    background-color: rgba(18, 18, 23, 0.9);
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 325px;
    max-height: calc(100% - 24px);
    height: auto;
    z-index: 1000;
    border-radius: 24px;
    position: absolute;
    left: 0;
    padding: 24px;
    margin: 12px;
    transition: 0.5s cubic-bezier(0.79, 0.14, 0.15, 0.86);

    &.list--collapsed {
        transform: translateX(-400px);
    }

    .list__filter {
        h4 {
            margin: 0 0 5px 0;
            color: white;
        }
        .filter__title {
            color: white;
            margin: 24px 0 0 0;
        }
        .filter__searchbox {
            width: 100%;
            padding: 12px;
            border-radius: 8px;
            border: 2px solid #161a1d;
            background-color: #1c1b24;
            outline: none;
            color: white;
            &:focus {
                border-color: #007afb;
            }
        }
    }
}
</style>
