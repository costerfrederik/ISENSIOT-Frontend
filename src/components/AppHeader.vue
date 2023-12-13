<template>
    <header class="header">
        <nav class="header__nav">
            <router-link to="/" class="nav__link" active-class="link--active">Live map</router-link>
            <router-link to="/settings" class="nav__link" active-class="link--active">Settings</router-link>
        </nav>
        <span class="header__divider"></span>
        <button class="header__action">Add new taxi</button>
    </header>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.header {
    border-bottom: 1px solid #eeeeee;
    background-color: white;
    padding: 0 24px;
    height: 75px;
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
            border: 1px solid #eeeeee;
            border-radius: 8px;
            padding: 14px 24px;
            color: black;
            text-decoration: none;
            font-size: 14px;

            &.link--active {
                background-color: #fafafa;
            }
        }
    }

    .header__divider {
        background-color: #eeeeee;
        height: 25px;
        width: 1px;
    }

    .header__action {
        background-color: black;
        border: 1px solid black;
        border-radius: 8px;
        padding: 14px 24px;
        color: white;
        font-size: 14px;
        cursor: pointer;
    }
}
</style>
