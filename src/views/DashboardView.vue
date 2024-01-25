<template>
    <section id="containerWrapper">
        <section id="taxiLocationContainer">
            <MapLocation :identifier="identifierFromUrl"></MapLocation>
        </section>
        <section id="cameraFeedContainer">
            <article>
                <router-link to="/" class="nav__link">← Back to live map</router-link>
                <article v-if="fenceStore.isTrespassing" class="trespassing">
                    <h3>Area Violation:</h3>
                    <p>Vehicle detected outside defined perimeter.</p>
                </article>
                <h1>{{ identifierFromUrl }}</h1>
                <p>
                    Dashboard overview for taxi with unique identifier:
                    {{ identifierFromUrl }}
                </p>
            </article>
            <DashboardVideo :identifier="identifierFromUrl"></DashboardVideo>
            <article class="information">
                <h3 class="information__title">Information:</h3>
                <article class="information__card">
                    <p class="card__title">Last position registered:</p>
                    <p class="card__value">{{ lastPosition }}</p>
                </article>
                <article class="information__card">
                    <p class="card__title">GPS Speed:</p>
                    <p class="card__value">{{ lastSpeed }}</p>
                </article>
            </article>
        </section>
    </section>
</template>

<script setup lang="ts">
import DashboardVideo from '@/components/Dashboard/DashboardVideo.vue';
import MapLocation from '@/components/Dashboard/MapLocation.vue';
import { requestData } from '@/socket';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useMapStore } from '@/stores/map';
import { useFenceStore } from '@/stores/fence';
const route = useRoute();
const mapStore = useMapStore();
const fenceStore = useFenceStore();

const identifierFromUrl = computed(() => {
    return route.params.identifier.toString();
});

const lastPosition = computed(() => {
    if (!mapStore.lockedMapObject || !mapStore.lockedMapObject.position) {
        return 'Never';
    }

    return new Date(mapStore.lockedMapObject.position.datetime).toLocaleString('nl-nl');
});

const lastSpeed = computed(() => {
    if (!mapStore.lockedMapObject || !mapStore.lockedMapObject.position) {
        return '0 km/h';
    }
    return `${mapStore.lockedMapObject.position.speed} km/h`;
});

onMounted(() => {
    requestData();
});
</script>

<style scoped lang="scss">
#containerWrapper {
    #taxiLocationContainer {
        height: 300px;
    }

    #cameraFeedContainer {
        padding: 48px 24px;
        display: flex;
        flex-direction: column;
        gap: 24px;

        article {
            .nav__link {
                display: inline-block;
                margin: 0 0 24px 0;
                font-size: 14px;
                text-decoration: none;
                color: #007afb;
                &:hover {
                    text-decoration: underline;
                }
            }

            h1 {
                font-size: 30px;
                margin: 0 0 5px 0;
            }

            p {
                margin: 0;
                color: #717171;
            }
        }

        .trespassing {
            border: 2px solid #d7b3b3;
            background-color: #ecc8c5;
            padding: 24px;
            border-radius: 12px;
            margin-bottom: 48px;

            min-height: 100px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            h3 {
                margin: 0;
            }
        }

        .information {
            display: flex;
            flex-direction: column;
            gap: 12px;

            .information__title {
                margin: 0;
            }

            .information__card {
                background-color: #fafafa;
                border: 2px solid #f3f3f3;
                margin: 0;
                padding: 24px;
                border-radius: 12px;
                min-height: 100px;
                display: flex;
                flex-direction: column;

                .card__title {
                    font-weight: 500;
                    margin-bottom: 12px;
                    font-size: 14px;
                }

                .card__value {
                    font-size: 22px;
                    font-weight: bold;
                    color: black;
                }
            }
        }
    }

    @media only screen and (min-width: 968px) {
        display: flex;
        flex-direction: row-reverse;
        height: calc(100vh - 70px);
        overflow-y: auto;

        #cameraFeedContainer {
            flex: 1;
            padding: 48px;

            .information {
                padding-bottom: 48px;
            }
        }
        #taxiLocationContainer {
            flex: 1;
            height: auto;
            position: sticky;
            top: 0;
        }
    }

    @media only screen and (min-width: 1200px) {
        #cameraFeedContainer {
            flex: 2;
        }
        #taxiLocationContainer {
            flex: 4;
        }
    }
}
</style>
