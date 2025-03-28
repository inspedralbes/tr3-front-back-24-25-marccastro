// Composables
import Auth from '@/components/Auth.vue';
import Dashboard from '@/components/Dashboard.vue';
import { createRouter, createWebHistory } from 'vue-router/auto'

const routes = [
  { path: '/', component: Auth},
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true }}
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
    next('/');
  } else {
    next();
  }
});

export default router