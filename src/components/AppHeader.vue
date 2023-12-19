<template>
    <header class="header">
        <nav class="header__nav">
            <router-link to="/" class="nav__link" active-class="link--active">Live map</router-link>
            <router-link to="/settings" class="nav__link" active-class="link--active">Settings</router-link>
        </nav>
        <span class="header__divider"></span>
        <button class="header__action" @click="openModal">Add new taxi</button>
    </header>
</template>

<script setup lang="ts">
import MockModal from './modals/MockModal.vue';
import { useModalStore } from '@/stores/modal';
const modalStore = useModalStore();

function openModal() {
    modalStore.openModal({ component: MockModal });
}
</script>

<style scoped lang="scss">
.header {
    //border-bottom: 1px solid #eeeeee;
    background-color: #121217;
    padding: 0 24px;
    height: 70px;
    width: 100%;

    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 24px;

    .header__nav {
        display: flex;
        align-items: center;
        gap: 12px;

        .nav__link {
            border: 2px solid #161a1d;
            border-radius: 8px;
            padding: 12px 24px;
            color: white;
            text-decoration: none;
            font-size: 14px;
            transition: background-color 0.3s;

            &:hover,
            &.link--active {
                background-color: #1c1b24;
            }
        }
    }

    .header__divider {
        background-color: #161a1d;
        height: 25px;
        width: 1px;
    }

    .header__action {
        background-color: #007afb;
        border: 2px solid #007afb;
        border-radius: 8px;
        padding: 12px 24px;
        color: white;
        font-size: 14px;
        cursor: pointer;
    }
}
</style>
