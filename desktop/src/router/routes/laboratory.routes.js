/**
 * Routes de gestion du laboratoire
 */
export default [
  {
    path: 'laboratory',
    name: 'Laboratory',
    component: () => import('@/views/laboratory/LabDashboard.vue'),
    meta: {
      title: 'Laboratoire',
      icon: 'ExperimentOutlined',
      requiresAuth: true,
      permissions: ['laboratory:view'],
    },
  },
  {
    path: 'laboratory/list',
    name: 'LaboratoryAnalyses',
    component: () => import('@/views/laboratory/AnalysisList.vue'),
    meta: {
      title: 'Liste des Analyses',
      requiresAuth: true,
      permissions: ['laboratory:view'],
    },
  },
  {
    path: 'laboratory/create',
    name: 'LaboratoryAnalysisCreate',
    component: () => import('@/views/laboratory/AnalysisCreate.vue'),
    meta: {
      title: 'Nouvelle Demande',
      requiresAuth: true,
      permissions: ['laboratory:create'],
    },
  },
  {
    path: 'laboratory/results-entry',
    name: 'LaboratoryResultsEntry',
    component: () => import('@/views/laboratory/ResultsEntry.vue'),
    meta: {
      title: 'Saisie des Résultats',
      requiresAuth: true,
      permissions: ['laboratory:enter_results'],
    },
  },
  {
    path: 'laboratory/results-validation',
    name: 'LaboratoryResultsValidation',
    component: () => import('@/views/laboratory/ResultsValidation.vue'),
    meta: {
      title: 'Validation des Résultats',
      requiresAuth: true,
      permissions: ['laboratory:validate'],
    },
  },
];
