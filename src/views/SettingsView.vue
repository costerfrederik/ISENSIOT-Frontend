<template>
    <div>
        <span>{{ data }}</span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { socket, socketState } from '@/socket';

export default defineComponent({
    name: 'SettingsView',
    computed: {
        data() {
            return socketState.payload;
        },
    },
    beforeUnmount() {
        socket.disconnect();
    },
});
</script>
