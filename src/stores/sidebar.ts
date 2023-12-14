import { defineStore } from 'pinia';

export const useSideBarStore = defineStore('sidebar', {
    state: (): State => {
        return {
            isOpen: true,
        };
    },
    actions: {
        toggleSidebar() {
            this.isOpen = !this.isOpen;
        },
    },
});

interface State {
    isOpen: boolean;
}
