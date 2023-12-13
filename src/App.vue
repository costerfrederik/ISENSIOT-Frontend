<template>
    <AppHeader></AppHeader>
    <router-view />
</template>

<script lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import '../node_modules/mapbox-gl/dist/mapbox-gl.css';

export default {
    name: 'App',
    components: {
        AppHeader,
    },
};
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
