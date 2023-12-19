<template>
    <Teleport to="body">
        <Transition name="modal-transition">
            <!-- <div class="modal" v-if="store.modalState?.component" @click.self="store.closeModal" aria-modal="true" role="dialog" tabindex="-1">-->
            <div class="modal" v-if="store.modalState?.component" aria-modal="true" role="dialog" tabindex="-1">
                <component :is="store.modalState?.component" v-bind="store.modalState?.props"></component>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { onUnmounted, onMounted } from 'vue';
import { useModalStore } from '@/stores/modal';
const store = useModalStore();

const escapeKeyListener = (event: KeyboardEvent) => {
    event.key === 'Escape' && store.closeModal();
};

onMounted(() => {
    document.addEventListener('keydown', escapeKeyListener);
});

onUnmounted(() => {
    document.removeEventListener('keydown', escapeKeyListener);
});
</script>

<style scoped lang="scss">
.modal {
    background: rgba(18, 18, 23, 0.6);
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 10000;
    padding: 24px;

    display: flex;
    align-items: center;
    justify-content: center;

    .modal__box {
        background: white;
        border-radius: 10px;
        padding: 24px;

        &.size--xs {
            max-width: 380px;
            width: 100%;
        }

        &.size--s {
            max-width: 468px;
            width: 100%;
        }

        &.size--l {
            max-width: 884px;
            width: 100%;
        }
    }
}

.modal-transition-enter-from,
.modal-transition-leave-to {
    opacity: 0;
}

.modal-transition-enter-active,
.modal-transition-leave-active {
    transition: opacity 0.2s ease;
}
</style>
