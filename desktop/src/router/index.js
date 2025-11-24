import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import {
  authRoutes,
  dashboardRoutes,
  patientsRoutes,
  consultationsRoutes,
  emergencyRoutes,
  laboratoryRoutes,
} from './routes';

const routes = [
  // Routes d'authentification
  ...authRoutes,

  // Routes principales (nécessitent authentification)
  {
    path: '/',
    component: () => import('@/views/layout/MainLayout.vue'),
    meta: { requiresAuth: true },
    redirect: '/dashboard',
    children: [
      ...dashboardRoutes,
      ...patientsRoutes,
      ...consultationsRoutes,
      ...emergencyRoutes,
      ...laboratoryRoutes,
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/settings/SettingsView.vue'),
        meta: { title: 'Paramètres', icon: 'SettingOutlined' },
      },
    ],
  },

  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/NotFoundView.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// Navigation guard pour l'authentification
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false);

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

// Mettre à jour le titre de la page
router.afterEach((to) => {
  const baseTitle = 'SGHI';
  document.title = to.meta.title ? `${to.meta.title} - ${baseTitle}` : baseTitle;
});

export default router;
