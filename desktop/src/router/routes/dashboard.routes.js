/**
 * Routes du tableau de bord
 */
export default [
  {
    path: 'dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/DashboardView.vue'),
    meta: {
      title: 'Tableau de bord',
      icon: 'DashboardOutlined',
      requiresAuth: true,
    },
  },
];
