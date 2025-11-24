/**
 * Routes de gestion des patients
 */
export default [
  {
    path: 'patients',
    name: 'Patients',
    component: () => import('@/views/patients/PatientsList.vue'),
    meta: {
      title: 'Patients',
      icon: 'UserOutlined',
      requiresAuth: true,
      permissions: ['patients:view'],
    },
  },
  {
    path: 'patients/create',
    name: 'PatientCreate',
    component: () => import('@/views/patients/PatientCreate.vue'),
    meta: {
      title: 'Nouveau patient',
      icon: 'UserAddOutlined',
      requiresAuth: true,
      permissions: ['patients:create'],
    },
  },
  {
    path: 'patients/:id',
    name: 'PatientDetail',
    component: () => import('@/views/patients/PatientDetails.vue'),
    meta: {
      title: 'Détails du patient',
      requiresAuth: true,
      permissions: ['patients:view'],
    },
  },
  {
    path: 'patients/:id/edit',
    name: 'PatientEdit',
    component: () => import('@/views/patients/PatientEdit.vue'),
    meta: {
      title: 'Modifier le patient',
      requiresAuth: true,
      permissions: ['patients:update'],
    },
  },
];
