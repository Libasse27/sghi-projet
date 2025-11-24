import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MainTabsParamList, HomeStackParamList, PatientsStackParamList, AppointmentsStackParamList } from './types';
import colors from '@styles/colors';

// Screens
import DashboardScreen from '@screens/home/DashboardScreen';
import ProfileScreen from '@screens/home/ProfileScreen';
import SettingsScreen from '@screens/home/SettingsScreen';
import PatientsListScreen from '@screens/patients/PatientsListScreen';
import PatientDetailScreen from '@screens/patients/PatientDetailScreen';
import PatientCreateScreen from '@screens/patients/PatientCreateScreen';
import AppointmentsListScreen from '@screens/appointments/AppointmentsListScreen';
import MenuScreen from '@screens/menu/MenuScreen';

const Tab = createBottomTabNavigator<MainTabsParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();
const PatientsStack = createStackNavigator<PatientsStackParamList>();
const AppointmentsStack = createStackNavigator<AppointmentsStackParamList>();

// Home Stack Navigator
const HomeNavigator = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <HomeStack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Tableau de bord' }}
      />
      <HomeStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Mon Profil' }}
      />
      <HomeStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Paramètres' }}
      />
    </HomeStack.Navigator>
  );
};

// Patients Stack Navigator
const PatientsNavigator = () => {
  return (
    <PatientsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <PatientsStack.Screen
        name="PatientsList"
        component={PatientsListScreen}
        options={{ title: 'Patients' }}
      />
      <PatientsStack.Screen
        name="PatientDetail"
        component={PatientDetailScreen}
        options={{ title: 'Détails du patient' }}
      />
      <PatientsStack.Screen
        name="PatientCreate"
        component={PatientCreateScreen}
        options={{ title: 'Nouveau patient' }}
      />
    </PatientsStack.Navigator>
  );
};

// Appointments Stack Navigator
const AppointmentsNavigator = () => {
  return (
    <AppointmentsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <AppointmentsStack.Screen
        name="AppointmentsList"
        component={AppointmentsListScreen}
        options={{ title: 'Rendez-vous' }}
      />
    </AppointmentsStack.Navigator>
  );
};

// Main Tabs Navigator
const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray400,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => (
            <Icon name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Patients"
        component={PatientsNavigator}
        options={{
          title: 'Patients',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-multiple" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Appointments"
        component={AppointmentsNavigator}
        options={{
          title: 'RDV',
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar-clock" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          title: 'Menu',
          tabBarIcon: ({ color, size }) => (
            <Icon name="menu" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
