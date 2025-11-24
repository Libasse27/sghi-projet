/**
 * Routes de gestion des urgences
 */
export default [
  {
    path: 'emergency',
    name: 'Emergency',
    component: () => import('@/views/emergency/EmergencyDashboard.vue'),
    meta: {
      title: 'Urgences',
      icon: 'AlertOutlined',
      requiresAuth: true,
      permissions: ['emergency:view'],
    },
  },
  {
    path: 'emergency/triage',
    name: 'EmergencyTriage',
    component: () => import('@/views/emergency/Triage.vue'),
    meta: {
      title: 'Triage des urgences',
      requiresAuth: true,
      permissions: ['emergency:triage'],
    },
  },
  {
    path: 'emergency/queue',
    name: 'EmergencyQueue',
    component: () => import('@/views/emergency/EmergencyQueue.vue'),
    meta: {
      title: 'File d\'attente',
      requiresAuth: true,
      permissions: ['emergency:view'],
    },
  },
];
