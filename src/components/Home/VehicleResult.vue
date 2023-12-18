<template>
    <article class="list__taxi" :class="{ 'taxi--focused': active, 'taxi--disabled': disabled }" @click="!disabled && handleSelect()">
        <section class="taxi__top">
            <img :src="require('@/assets/' + iconName)" :alt="iconName" height="24" width="24" />
            <h4 class="taxi__identifier">{{ identifier }}</h4>
        </section>
        <p class="taxi__lastposition">{{ lastPosition }}</p>
        <img class="taxi__lock" v-if="active" src="@/assets/locked_icon.png" alt="View locked icon" height="24" width="24" />
    </article>
</template>

<script setup lang="ts">
const emit = defineEmits(['onSelect']);
const props = defineProps({
    iconName: {
        type: String,
        required: true,
    },
    identifier: {
        type: String,
        required: true,
    },
    lastPosition: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

function handleSelect() {
    emit('onSelect');
}
</script>

<style scoped lang="scss">
.list__taxi {
    border: 2px solid #161a1d;
    border-radius: 12px;
    cursor: pointer;
    min-height: 80px;
    padding: 12px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    user-select: none;
    position: relative;
    &.taxi--disabled {
        cursor: not-allowed;
    }

    &.taxi--focused {
        background-color: #1c1b24;
        border-color: #007afb;
    }

    .taxi__lock {
        position: absolute;
        right: -12px;
        top: 0;
        bottom: 0;
        margin: auto 0;
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
</style>
