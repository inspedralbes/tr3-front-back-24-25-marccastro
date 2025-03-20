// Composables
import Auth from '@/components/Auth.vue';
import Dashboard from '@/components/Dashboard.vue';
import { createRouter, createWebHistory } from 'vue-router/auto'

const routes = [
  { path: '/', component: Auth},
  { path: '/dashboard', component: Dashboard}
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router