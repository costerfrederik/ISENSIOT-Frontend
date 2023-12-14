<template>
    <MapInteractive></MapInteractive>
</template>

<script setup lang="ts">
import MapInteractive from '@/components/Home/MapInteractive.vue';
import { onBeforeUnmount } from 'vue';
import { socket, socketState } from '@/socket';

onBeforeUnmount(() => {
    socket.disconnect();
});
</script>

<style scoped lang="scss"></style>
