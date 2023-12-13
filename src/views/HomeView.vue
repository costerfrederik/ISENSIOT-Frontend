<template>
    <section class="overview">
        <section class="overview__list">
            <article class="list__taxi">
                <section class="taxi__top">
                    <img src="@/assets/taxi_icon.png" alt="" height="24" width="24" />
                    <h4 class="taxi__identifier">1-ZRG-83</h4>
                </section>
                <p class="taxi__lastposition">Last position: 1 day ago</p>
            </article>
            <article class="list__taxi">
                <section class="taxi__top">
                    <img src="@/assets/warning_icon.png" alt="" height="24" width="24" />
                    <h4 class="taxi__identifier">21-BG-05</h4>
                </section>
                <p class="taxi__lastposition">Last position: Never</p>
            </article>
        </section>

        <section class="overview__map"></section>
    </section>
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
    beforeUnmount() {
        socket.disconnect();
    },
});
</script>

<style scoped lang="scss">
.overview {
    display: flex;
    height: calc(100vh - 75px);
    .overview__list {
        border-right: 1px solid #eeeeee;
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 350px;
        height: 100%;
        padding: 24px;

        .list__taxi {
            border: 1px solid #eeeeee;
            border-radius: 8px;
            cursor: pointer;
            height: 80px;
            padding: 12px;
            display: flex;
            justify-content: space-between;
            flex-direction: column;

            .taxi__top {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .taxi__identifier {
                margin: 0;
            }

            .taxi__lastposition {
                color: #818181;
                margin: 0;
                font-size: 13px;
            }
        }
    }

    .overview__map {
        // background-color: #111111;
        flex: 1;
    }
}
</style>
