import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Ref } from 'vue';

export const useFenceStore = defineStore('fence', () => {
    const mapBoxDraw: Ref<MapboxDraw | undefined> = ref();
    const isTrespassing: Ref<boolean> = ref(false);

    const drawDB: Ref<MultiPolygon | undefined> = ref();
    const drawLocal: Ref<MultiPolygon | undefined> = ref();
    const drawHasUnsavedChanged: Ref<boolean> = ref(false);
    const drawDisabled: Ref<boolean> = ref(true);

    function addPolygonsToInstance(multiPolygon: MultiPolygon | undefined) {
        if (!mapBoxDraw.value) {
            return;
        }

        mapBoxDraw.value.deleteAll();

        if (!multiPolygon) {
            return;
        }

        for (let i = 0; i < multiPolygon.coordinates.length; i++) {
            const polygon: Polygon = { type: 'Polygon', coordinates: multiPolygon.coordinates[i] };
            mapBoxDraw.value.add(polygon);
        }
    }

    function resetStateToInitial() {
        mapBoxDraw.value = undefined;
        isTrespassing.value = false;
        drawDB.value = undefined;
        drawLocal.value = undefined;
        drawHasUnsavedChanged.value = false;
        drawDisabled.value = true;
    }

    return { mapBoxDraw, isTrespassing, drawDB, drawLocal, drawHasUnsavedChanged, drawDisabled, resetStateToInitial, addPolygonsToInstance };
});
