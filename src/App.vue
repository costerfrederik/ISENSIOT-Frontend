<template>
    <AppHeader></AppHeader>
    <router-view />
    <AppModal></AppModal>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import '../node_modules/mapbox-gl/dist/mapbox-gl.css';
import AppModal from '@/components/modals/AppModal.vue';
</script>

<style lang="scss">
html,
body {
    overflow: hidden;
    margin: 0;
    height: 100%;
}
* {
    font-family: 'Inter', sans-serif;
    box-sizing: border-box;
}
#app {
    height: 100%;
}

// Styling for mapboxgl
canvas {
    outline: none !important;
}

.marker {
    background-image: url('/src/assets/marker_icon.png');
    background-color: #121217;
    background-size: 80%;
    background-repeat: no-repeat;
    background-position: center;
    border: 2px solid #161a1d;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    transition: border-color 0.3s;
    &.marker--active {
        border-color: #007afb;
    }
}

/* Marker tweaks */
.mapboxgl-popup-content {
    transform: perspective(1px) translateZ(0);
    backface-visibility: hidden;
    border-radius: 12px;
    padding: 12px;
    width: 180px;
    .popup-inner {
        display: flex;
        flex-direction: column;
        h3 {
            margin: 0;
            font-size: 16px;
        }
        span {
            margin: 0;
            font-weight: 400;
        }
        button {
            margin-top: 12px;
            background-color: #007afb;
            border: 2px solid #007afb;
            border-radius: 8px;
            padding: 8px 24px;
            color: white;
            font-size: 14px;
            cursor: pointer;
        }
    }
}
</style>
