<template>
    <section class="overview__list" :class="{ 'list--collapsed': !sideBarStore.isOpen }">
        <section class="list__filter">
            <h4>Filter</h4>
            <input class="filter__searchbox" type="text" name="searchbox" placeholder="Search Vehicles by identifier" />
            <h4 class="filter__title">Your vehicles</h4>
        </section>
        <article class="list__taxi taxi--focused">
            <section class="taxi__top">
                <img src="@/assets/taxi_icon.png" alt="" height="24" width="24" />
                <h4 class="taxi__identifier">1-ZRG-83</h4>
            </section>
            <p class="taxi__lastposition">Last position: 23s ago</p>
        </article>
        <article class="list__taxi">
            <section class="taxi__top">
                <img src="@/assets/warning_icon.png" alt="" height="24" width="24" />
                <h4 class="taxi__identifier">Ferrari F140</h4>
            </section>
            <p class="taxi__lastposition">Last position: Never</p>
        </article>
    </section>
</template>

<script setup lang="ts">
import { useSideBarStore } from '@/stores/sidebar';
const sideBarStore = useSideBarStore();
</script>

<style scoped lang="scss">
.overview__list {
    background-color: rgba(18, 18, 23, 0.9);
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 325px;
    max-height: calc(100% - 94px);
    height: auto;
    z-index: 1000;
    border-radius: 24px;
    position: absolute;
    left: 0;
    padding: 24px;
    margin: 12px;
    transition: 0.5s cubic-bezier(0.79, 0.14, 0.15, 0.86);

    &.list--collapsed {
        transform: translateX(-400px);
    }

    .list__filter {
        h4 {
            margin: 0 0 5px 0;
            color: white;
        }
        .filter__title {
            color: white;
            margin: 24px 0 0 0;
        }
        .filter__searchbox {
            width: 100%;
            padding: 12px;
            border-radius: 8px;
            border: 2px solid #161a1d;
            background-color: #1c1b24;
            outline: none;
            color: white;
            &:focus {
                border-color: #007afb;
            }
        }
    }

    .list__taxi {
        border: 2px solid #161a1d;
        border-radius: 12px;
        cursor: pointer;
        min-height: 80px;
        padding: 12px;
        display: flex;
        justify-content: space-between;
        flex-direction: column;

        &.taxi--focused {
            background-color: #1c1b24;
            border-color: #007afb;
        }

        .taxi__top {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            gap: 12px;
        }

        .taxi__identifier {
            margin: 0;
            color: white;
        }

        .taxi__lastposition {
            color: #818181;
            margin: 0;
            font-size: 13px;
        }
    }
}
</style>
