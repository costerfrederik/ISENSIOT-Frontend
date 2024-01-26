<template>
    <section class="wrapper">
        <article class="wrapper__header">
            <router-link to="/" class="nav__link">← Back to live map</router-link>

            <h1>Violations</h1>
            <p>Log of all fence violations.</p>
        </article>
        <section class="table-container">
            <table>
                <tr>
                    <th width="8%">Vehicle</th>
                    <th width="82%">Violation datetime</th>
                    <th width="10%">Location</th>
                </tr>
                <tr v-for="violation in mapStore.violationLog" :key="violation.id">
                    <td>
                        <router-link :to="'/dashboard/' + violation.vehicle_identifier">{{ violation.vehicle_identifier }}</router-link>
                    </td>
                    <td>{{ convertDate(violation.datetime) }}</td>
                    <td>
                        <a :href="'https://www.google.com/maps/place/' + violation.latitude + ',' + violation.longitude" target="_blank"
                            >Open in Google Maps</a
                        >
                    </td>
                </tr>
            </table>
        </section>
    </section>
</template>

<script setup lang="ts">
import { requestViolations } from '@/socket';
import { onMounted, onUnmounted } from 'vue';
import { useMapStore } from '@/stores/map';

const mapStore = useMapStore();

function convertDate(datetime: Date) {
    return new Date(datetime).toLocaleString('nl-nl');
}

onMounted(() => {
    requestViolations();
});

onUnmounted(() => {
    mapStore.resetStateToInitial();
});
</script>

<style scoped lang="scss">
.wrapper {
    padding: 48px 24px;

    .wrapper__header {
        margin-bottom: 48px;

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

    .table-container {
        border: 1px solid #e8ebf0;
        border-radius: 12px;
        overflow-x: auto;
    }

    table {
        border-collapse: collapse;
        width: 100%;

        th {
            font-weight: 500;
        }

        th,
        td {
            padding: 16px;
            white-space: nowrap;
        }

        tr {
            text-align: left;
            font-size: 14px;
            &:nth-child(odd) {
                background-color: #fbfcfc;
            }

            &:not(:last-child) {
                border-bottom: 1px solid #e8ebf0;
            }
        }
        a {
            display: inline-block;
            font-size: 14px;
            text-decoration: none;
            color: #007afb;
            &:hover {
                text-decoration: underline;
            }
        }
    }

    @media only screen and (min-width: 968px) {
        padding: 48px;
    }
}
</style>
