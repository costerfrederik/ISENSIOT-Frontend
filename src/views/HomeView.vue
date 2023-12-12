<template>
    <div>
        <span>{{ data }}</span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { socket, socketState } from '@/socket';

export default defineComponent({
    name: 'HomeView',
    computed: {
        data() {
            return socketState.payload;
        },
    },
    // mounted() {
    //     console.log(socketState.payload);
    // },
    beforeUnmount() {
        socket.disconnect();
    },
});
</script>
