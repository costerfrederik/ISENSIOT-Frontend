import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import DashboardView from '@/views/DashboardView.vue';
import ViolationsView from '@/views/ViolationsView.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
    },
    {
        path: '/violations',
        name: 'violations',
        component: ViolationsView,
    },
    {
        path: '/dashboard/:identifier',
        name: 'dashboard',
        component: DashboardView,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
