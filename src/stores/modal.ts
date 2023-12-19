import { defineStore } from 'pinia';
import { extend } from '@vue/shared';
import { markRaw } from 'vue';

const component = extend({});
type VueComponent = InstanceType<typeof component>;

export interface IModalProps {
    component: null | VueComponent;
    props?: object;
}

export interface IModalState {
    modalState: IModalProps;
}

const defaultState: IModalProps = {
    component: null,
    props: {},
};

export const useModalStore = defineStore('modal', {
    state: (): IModalState => ({ modalState: defaultState }),
    actions: {
        openModal(payload: IModalProps) {
            const props = payload.props;
            const component = markRaw(payload.component);

            this.modalState = { component, props: props || {} };
        },
        closeModal() {
            this.modalState = defaultState;
        },
    },
    getters: {},
});
