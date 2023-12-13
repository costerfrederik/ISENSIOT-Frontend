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
    overflow-x: hidden;
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
</style>
