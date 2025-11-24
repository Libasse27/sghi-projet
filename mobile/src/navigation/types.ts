import { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Home Stack
export type HomeStackParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Settings: undefined;
};

// Patients Stack
export type PatientsStackParamList = {
  PatientsList: undefined;
  PatientDetail: { patientId: string };
  PatientCreate: undefined;
  PatientEdit: { patientId: string };
};

// Appointments Stack
export type AppointmentsStackParamList = {
  AppointmentsList: undefined;
  AppointmentDetail: { appointmentId: string };
  AppointmentCreate: undefined;
};

// Bottom Tabs
export type MainTabsParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Patients: NavigatorScreenParams<PatientsStackParamList>;
  Appointments: NavigatorScreenParams<AppointmentsStackParamList>;
  Menu: undefined;
};

// Root Stack
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabsParamList>;
  Splash: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
