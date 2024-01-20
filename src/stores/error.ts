import { FormError } from '@/interfaces/FormError';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Ref } from 'vue';

export const useErrorStore = defineStore('error', () => {
    const error: Ref<FormError | undefined> = ref();

    return { error };
});
