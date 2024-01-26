<template>
    <video
        ref="videoElement"
        class="video"
        poster="@/assets/cameraLoading.jpg"
        @play="catchUpVideo"
        autoplay
        controls
        muted
        playsinline="true"
    ></video>
</template>

<script setup lang="ts">
import Hls from 'hls.js';
import { onMounted, onBeforeUnmount, ref, computed } from 'vue';

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

const videoHls = ref<Hls | null>(null);
const videoElement = ref<HTMLVideoElement | null>(null);

const streamURL = computed(() => {
    return 'http://37.97.206.253:8888/' + props.identifier + '/index.m3u8';
});

function handleVisibilityChange() {
    if (!document.hidden) {
        catchUpVideo();
    }
}

function catchUpVideo() {
    if (videoElement.value) {
        videoElement.value.currentTime = 0;
    }
}

function loadVideo() {
    if (videoElement.value) {
        if (Hls.isSupported()) {
            videoHls.value = new Hls({
                maxLiveSyncPlaybackRate: 1.5,
            });

            videoHls.value.on(Hls.Events.ERROR, (evt, data) => {
                if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                    videoHls.value?.recoverMediaError();
                } else if (data.fatal) {
                    videoHls.value?.destroy();
                    setTimeout(() => loadVideo(), 2000);
                }
            });

            videoHls.value.on(Hls.Events.MEDIA_ATTACHED, () => {
                videoHls.value?.loadSource(streamURL.value);
            });

            videoHls.value.on(Hls.Events.MANIFEST_PARSED, () => {
                videoElement.value?.play();
            });

            videoHls.value.attachMedia(videoElement.value);
        } else if (videoElement.value.canPlayType('application/vnd.apple.mpegurl')) {
            fetch(streamURL.value).then(() => {
                if (videoElement.value) {
                    videoElement.value.src = streamURL.value;
                    videoElement.value.play();
                }
            });
        }
    }
}

onMounted(async () => {
    loadVideo();
});

onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>

<style scoped lang="scss">
.video {
    background-color: black;
    aspect-ratio: 16/9;
    width: 100%;
    border-radius: 12px;
}
</style>
