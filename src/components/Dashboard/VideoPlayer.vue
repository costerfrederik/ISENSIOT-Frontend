<template>
    <video ref="videoPlayer" id="my-video" class="video-js" data-setup="{}">
        <source :src="'http://37.97.206.253:8888/1ZRG83/index.m3u8'" type="application/x-mpegURL" />
    </video>
</template>

<script setup lang="ts">
import videojs from 'video.js';
import { defineProps, onMounted, onBeforeUnmount, ref } from 'vue';

const props = defineProps({
    options: {
        type: Object,
        default: () => ({}),
        required: false,
    },
});

let player: any = null;
const videoPlayer = ref<HTMLVideoElement | null>(null);

onMounted(() => {
    if (videoPlayer.value) {
        player = videojs(videoPlayer.value, props.options, () => {
            player?.log('onPlayerReady', this);
        });
    }
});

onBeforeUnmount(() => {
    if (player) {
        player.dispose();
    }
});
</script>

<style scoped lang="scss">
#my-video {
    overflow: hidden;
    width: 100%;
    border-radius: 12px;
    margin-bottom: 24px;
}
</style>
