// Composables
import Auth from '@/components/Auth.vue';
import BoxheadControl from '@/components/Boxhead-Control.vue';
import { createRouter, createWebHistory } from 'vue-router/auto'

const routes = [
  { path: '/', component: Auth},
  { path: '/boxhead-control', component: BoxheadControl}
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router