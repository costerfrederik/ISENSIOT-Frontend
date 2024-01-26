<template>
    <section class="wrapper">
        <article class="wrapper__header">
            <router-link to="/" class="nav__link">← Back to live map</router-link>

            <h1>Violations {{ violationStore.violationLog && '(' + violationStore.violationLog?.length + ')' }}</h1>
            <p>Fence violations log of the last 7 days</p>
        </article>
        <section v-if="totalPages > 1" class="pagination">
            <button @click="previousPage" :disabled="violationStore.currentPage === 1">Previous</button>
            <p>{{ violationStore.currentPage }}/{{ totalPages }}</p>
            <button @click="nextPage" :disabled="violationStore.currentPage === totalPages">Next</button>
        </section>
        <section class="table-container">
            <table>
                <tr>
                    <th width="8%">Vehicle</th>
                    <th width="8%">Violation datetime</th>
                    <th width="74%">GPS Speed</th>
                    <th width="10%">Location</th>
                </tr>
                <tr v-for="violation in paginated" :key="violation.id">
                    <td>
                        <router-link :to="'/dashboard/' + violation.vehicle_identifier">{{ violation.vehicle_identifier }}</router-link>
                    </td>
                    <td>{{ convertDate(violation.datetime) }}</td>
                    <td>{{ violation.speed + ' km/h' }}</td>
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
import { onMounted, onUnmounted, computed } from 'vue';
import { useViolationStore } from '@/stores/violation';

const violationStore = useViolationStore();

function convertDate(datetime: Date) {
    return new Date(datetime).toLocaleString('nl-nl');
}

const indexStart = computed(() => {
    return (violationStore.currentPage - 1) * violationStore.pageSize;
});

const indexEnd = computed(() => {
    return indexStart.value + violationStore.pageSize;
});

const paginated = computed(() => {
    if (!violationStore.violationLog) {
        return;
    }

    return violationStore.violationLog.slice(indexStart.value, indexEnd.value);
});

const totalPages = computed(() => {
    if (!violationStore.violationLog) {
        return 1;
    }

    return Math.ceil(violationStore.violationLog.length / violationStore.pageSize);
});

function previousPage() {
    if (violationStore.currentPage === 1) {
        return;
    }
    violationStore.currentPage -= 1;
}

function nextPage() {
    if (violationStore.currentPage == totalPages.value) {
        return;
    }
    violationStore.currentPage += 1;
}

onMounted(() => {
    document.body.style.overflowY = 'auto';
    requestViolations();
});

onUnmounted(() => {
    document.body.style.overflowY = 'hidden';
    violationStore.resetStateToInitial();
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

    .pagination {
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        button {
            background-color: #007afb;
            border: 2px solid #007afb;
            border-radius: 8px;
            padding: 6px 12px;
            color: white;
            font-size: 14px;
            cursor: pointer;
            transition: 0.15s;
            &:hover {
                background-color: #006ee2;
            }
            &:disabled {
                opacity: 0.5;
                cursor: default;
            }
        }
        p {
            margin: 0;
            font-size: 14px;
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
