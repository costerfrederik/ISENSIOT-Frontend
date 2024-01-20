<template>
    <MapInteractive></MapInteractive>
</template>

<script setup lang="ts">
import MapInteractive from '@/components/Home/MapInteractive.vue';
import { requestData } from '@/socket';
import { onMounted } from 'vue';

onMounted(() => {
    requestData();
});
</script>

<style scoped lang="scss"></style>
