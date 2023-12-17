<template>
    <AppHeader></AppHeader>
    <router-view />
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import '../node_modules/mapbox-gl/dist/mapbox-gl.css';
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
</style>
