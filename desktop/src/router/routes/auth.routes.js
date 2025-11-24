/**
 * Routes d'authentification
 */
export default [
  {
    path: '/auth',
    name: 'Auth',
    redirect: '/auth/login',
    component: () => import('@/views/layout/AuthLayout.vue'),
    meta: { requiresAuth: false },
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/auth/LoginView.vue'),
        meta: {
          title: 'Connexion',
          requiresAuth: false,
        },
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/auth/RegisterView.vue'),
        meta: {
          title: 'Inscription',
          requiresAuth: false,
        },
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: () => import('@/views/auth/ForgotPasswordView.vue'),
        meta: {
          title: 'Mot de passe oublié',
          requiresAuth: false,
        },
      },
    ],
  },
];
