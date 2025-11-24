/**
 * Export centralisé de toutes les routes
 */
import authRoutes from './auth.routes';
import dashboardRoutes from './dashboard.routes';
import patientsRoutes from './patients.routes';
import consultationsRoutes from './consultations.routes';
import emergencyRoutes from './emergency.routes';
import laboratoryRoutes from './laboratory.routes';

export {
  authRoutes,
  dashboardRoutes,
  patientsRoutes,
  consultationsRoutes,
  emergencyRoutes,
  laboratoryRoutes,
};
