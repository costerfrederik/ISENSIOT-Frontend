<template>
    <section class="overview__list" :class="{ 'list--collapsed': !sideBarStore.isOpen }">
        <section class="list__filter">
            <h4>Filter</h4>
            <input class="filter__searchbox" v-model="searchQuery" type="text" name="searchbox" placeholder="Search Vehicles by identifier" />
            <h4 class="filter__title">Your vehicles</h4>
        </section>
        <template v-if="vehiclesLoading">
            <article class="list__taxi taxi--disabled">
                <section class="taxi__top">
                    <img src="@/assets/time_icon.png" alt="loading icon" height="24" width="24" />
                    <h4 class="taxi__identifier">Loading your vehicles</h4>
                </section>
                <p class="taxi__lastposition">Your linked vehicles are being loaded in.</p>
            </article>
        </template>
        <template v-else-if="!socketState.mapData || !socketState.mapData.length">
            <article class="list__taxi taxi--disabled">
                <section class="taxi__top">
                    <img src="@/assets/notlinked_icon.png" alt="Nothing linked icon" height="24" width="24" />
                    <h4 class="taxi__identifier">No vehicles linked</h4>
                </section>
                <p class="taxi__lastposition">Linked vehicles will be shown here. But you have none.</p>
            </article>
        </template>
        <template v-else-if="!filteredMapObjects.length">
            <article class="list__taxi taxi--disabled">
                <section class="taxi__top">
                    <img src="@/assets/notfound_icon.png" alt="Not found icon" height="24" width="24" />
                    <h4 class="taxi__identifier">No vehicles found</h4>
                </section>
                <p class="taxi__lastposition">Your search query did not have any results.</p>
            </article>
        </template>
        <template v-else>
            <article v-for="mapObject in filteredMapObjects" v-bind:key="mapObject.identifier" class="list__taxi">
                <section class="taxi__top">
                    <img v-if="mapObject.position" src="@/assets/taxi_icon.png" alt="taxi icon" height="24" width="24" />
                    <img v-else src="@/assets/warning_icon.png" alt="warning icon" height="24" width="24" />
                    <h4 class="taxi__identifier">{{ mapObject.identifier }}</h4>
                </section>
                <p class="taxi__lastposition">Last position: {{ lastPositionFormatted(mapObject.position) }}</p>
            </article>
        </template>
    </section>
</template>

<script setup lang="ts">
import { socketState } from '@/socket';
import { onMounted, ref } from 'vue';
import { computed } from 'vue';
import { Position, MapDataObject } from '@/interfaces/MapData';
import { useSideBarStore } from '@/stores/sidebar';
const sideBarStore = useSideBarStore();

// Searchbar
const searchQuery = ref('');
const filteredMapObjects = computed(() => {
    return socketState.mapData.filter((mapObject: MapDataObject) => {
        return mapObject.identifier.toLowerCase().trim().includes(searchQuery.value.toLowerCase().trim());
    });
});

const vehiclesLoading = ref(true);

function lastPositionFormatted(position: Position | undefined) {
    if (!position) {
        return 'Never';
    }
    return new Date(position.datetime).toLocaleString('nl-nl');
}

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
    max-height: calc(100% - 94px);
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

    .list__taxi {
        border: 2px solid #161a1d;
        border-radius: 12px;
        cursor: pointer;
        min-height: 80px;
        padding: 12px;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        &.taxi--disabled {
            cursor: initial;
        }

        &.taxi--focused {
            background-color: #1c1b24;
            border-color: #007afb;
        }

        .taxi__top {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            gap: 12px;
        }

        .taxi__identifier {
            margin: 0;
            color: white;
        }

        .taxi__lastposition {
            color: #818181;
            margin: 0;
            font-size: 13px;
        }
    }
}
</style>
