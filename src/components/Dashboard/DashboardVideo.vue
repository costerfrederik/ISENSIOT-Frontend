<template>
    <video ref="videoElement" id="video" class="video-js video" poster="@/assets/cameraLoading.png"></video>
</template>

<script setup lang="ts">
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import { onMounted, onBeforeUnmount, ref, computed, watch } from 'vue';

const props = defineProps({
    options: {
        type: Object,
        default: () => ({}),
        required: false,
    },
    identifier: {
        type: String,
        required: true,
    },
});

const videoElement = ref<HTMLVideoElement | null>(null);
const videoPlayer = ref<Player | null>(null);
const intervalTimer = ref<number | undefined>();
const streamOnline = ref<boolean>(false);
const streamStatusInterval = 2000;

const streamURL = computed(() => {
    return 'http://37.97.206.253:8888/' + props.identifier + '/index.m3u8';
});

async function isStreamOnline() {
    try {
        const response = await fetch(streamURL.value);
        return response.ok;
    } catch (error: any) {
        return false;
    }
}

function handleStreamStatus(newStatus: boolean, oldStatus: boolean) {
    if (newStatus && !oldStatus) {
        const video = videojs.getPlayer('video');
        video.src({
            src: streamURL.value,
            type: 'application/x-mpegURL',
        });
    }

    if (!newStatus && oldStatus) {
        const video = videojs.getPlayer('video');
        video.load(); // show poster
        video.reset();
    }
}

onMounted(async () => {
    watch(streamOnline, (newStatus, oldStatus) => {
        handleStreamStatus(newStatus, oldStatus);
    });

    intervalTimer.value = setInterval(async () => {
        streamOnline.value = await isStreamOnline();
    }, streamStatusInterval);

    if (videoElement.value) {
        const newOptions = {
            ...props.options,
            sources: [
                {
                    src: streamURL.value,
                    type: 'application/x-mpegURL',
                },
            ],
        };
        videoPlayer.value = videojs(videoElement.value, newOptions);
    }
});

onBeforeUnmount(() => {
    if (videoPlayer.value) {
        videoPlayer.value.dispose();
    }

    if (intervalTimer.value) {
        clearInterval(intervalTimer.value);
    }
});
</script>

<style scoped lang="scss">
.video {
    overflow: hidden;
    width: 100%;
    border-radius: 12px;
    margin-bottom: 24px;
}

.video-js.vjs-ended .vjs-poster {
    display: block;
}
</style>
