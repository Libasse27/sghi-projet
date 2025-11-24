/**
 * Routes de gestion des consultations
 */
export default [
  {
    path: 'consultations',
    name: 'Consultations',
    component: () => import('@/views/consultations/ConsultationsList.vue'),
    meta: {
      title: 'Consultations',
      icon: 'MedicineBoxOutlined',
      requiresAuth: true,
      permissions: ['consultations:view'],
    },
  },
  {
    path: 'consultations/calendar',
    name: 'ConsultationsCalendar',
    component: () => import('@/views/consultations/Calendar.vue'),
    meta: {
      title: 'Calendrier',
      requiresAuth: true,
      permissions: ['consultations:view'],
    },
  },
  {
    path: 'consultations/create',
    name: 'ConsultationCreate',
    component: () => import('@/views/consultations/ConsultationCreate.vue'),
    meta: {
      title: 'Nouvelle consultation',
      requiresAuth: true,
      permissions: ['consultations:create'],
    },
  },
  {
    path: 'consultations/:id',
    name: 'ConsultationDetail',
    component: () => import('@/views/consultations/ConsultationDetails.vue'),
    meta: {
      title: 'Détails de la consultation',
      requiresAuth: true,
      permissions: ['consultations:view'],
    },
  },
];
