import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Ref } from 'vue';

export const useSideBarStore = defineStore('sidebar', () => {
    const isOpen: Ref<boolean> = ref(true);

    function toggleSidebar() {
        isOpen.value = !isOpen.value;
    }

    function resetStateToInitial() {
        isOpen.value = true;
    }

    return { isOpen, toggleSidebar, resetStateToInitial };
});
