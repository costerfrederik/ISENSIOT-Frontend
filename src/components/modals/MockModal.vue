<template>
    <article class="modal__box" :class="size">
        <section class="box__top">
            <h2 class="box__title">Link taxi</h2>
            <p class="box__subtitle">Link a taxi identifier to allow position updates to be sent to the server.</p>
        </section>
        <form action="" class="box__form">
            <div v-if="errorStore.error" class="form__error" :class="{ 'error--success': errorStore.error.success }">
                {{ errorStore.error.message }}
            </div>
            <section class="form__group">
                <label for="identifier">Vehicle Identifier</label>
                <input v-model="identifierField" type="text" id="identifier" name="identifier" placeholder="Vehicle Identifier" required />
            </section>
        </form>
        <article class="box__actions">
            <button @click="modalStore.closeModal" class="button__secondary">Cancel</button>
            <button @click="addNewTaxi" class="button__main">Add new taxi</button>
        </article>
    </article>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';
import { useModalStore } from '@/stores/modal';
import ModalSize from '@/enums/ModalSize';
import { newTaxiSchema } from '@/validation/NewTaxiSchema';
import { createTaxi } from '@/socket';
import { useErrorStore } from '@/stores/error';

const identifierField = ref();

const modalStore = useModalStore();
const size = ModalSize.extraSmall;

const errorStore = useErrorStore();

function addNewTaxi() {
    const formData = {
        identifier: identifierField.value,
    };

    const { error, value } = newTaxiSchema.validate(formData);
    if (error) {
        errorStore.error = {
            message: error.message,
            success: false,
        };
        return;
    }

    createTaxi(value);
}
</script>

<style scoped lang="scss">
.modal__box {
    display: flex;
    flex-direction: column;
    gap: 24px;
}
.box__top {
    .box__title {
        color: #121217;
        margin: 0 0 5px;
    }
    .box__subtitle {
        color: #667085;
        font-size: 15px;
        margin: 0;
    }
}
.box__form {
    display: flex;
    flex-direction: column;
    gap: 24px;

    .form__error {
        border: 2px solid #d7b3b3;
        background-color: #ecc8c5;
        border-radius: 8px;
        font-size: 14px;
        padding: 12px;

        &.error--success {
            border: 2px solid #6abd6e;
            background-color: #81c784;
        }
    }
    .form__group {
        display: flex;
        flex-direction: column;
        label {
            font-size: 15px;
            margin-bottom: 5px;
            pointer-events: none;
            color: #090b17;
        }
        input[type='text'] {
            background-color: white;
            border: 2px solid #e2e8ea;
            border-radius: 8px;
            outline: none;
            padding: 16px 12px;
            &:focus {
                border: 2px solid #007afb;
            }
        }
    }
}
.box__actions {
    display: flex;
    gap: 5px;

    button {
        border-radius: 8px;
        padding: 12px 24px;
        font-size: 14px;
        cursor: pointer;
        flex: 1;
    }

    .button__secondary {
        color: black;
        background-color: #f0f3f4;
        border: 2px solid #f0f3f4;
    }

    .button__main {
        color: white;
        background-color: #007afb;
        border: 2px solid #007afb;
    }
}
</style>
