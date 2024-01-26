import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Ref } from 'vue';
import { Violation } from '@/interfaces/Violation';

export const useViolationStore = defineStore('violation', () => {
    const violationLog: Ref<Violation[] | undefined> = ref();
    const pagedViolationLog: Ref<Violation[] | undefined> = ref();
    const pageSize: Ref<number> = ref(15);
    const currentPage: Ref<number> = ref(1);

    function resetStateToInitial() {
        violationLog.value = undefined;
        pagedViolationLog.value = undefined;
        pageSize.value = 15;
        currentPage.value = 1;
    }

    return { pageSize, currentPage, violationLog, pagedViolationLog, resetStateToInitial };
});
