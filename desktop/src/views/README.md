# Views Directory Structure

Ce document liste toutes les vues créées et à créer pour l'application SGHI Desktop.

## ✅ Vues Créées

### Authentication (3/3)
- ✅ auth/Login.vue
- ✅ auth/Register.vue
- ✅ auth/ForgotPassword.vue

### Dashboard (1/1)
- ✅ dashboard/Dashboard.vue

## 📝 Vues à Créer

### Patients (4 vues)
Utiliser les composants : PatientForm, PatientsTable, PatientDetailsModal

- **PatientsList.vue** - Liste des patients avec recherche et filtres
- **PatientDetails.vue** - Détails complets du patient avec historique médical
- **PatientCreate.vue** - Formulaire de création de patient (utilise PatientForm)
- **PatientEdit.vue** - Formulaire d'édition de patient (utilise PatientForm)

### Consultations (4 vues)
Utiliser les composants : ConsultationForm, DataTable, CalendarWidget

- **ConsultationsList.vue** - Liste des consultations
- **ConsultationCreate.vue** - Nouvelle consultation (utilise ConsultationForm)
- **ConsultationDetails.vue** - Détails de consultation
- **Calendar.vue** - Calendrier des consultations (utilise CalendarWidget)

### Emergency (3 vues)
Composants nécessaires : StatsCard, DataTable avec filtres de priorité

- **EmergencyDashboard.vue** - Dashboard urgences avec stats P1-P5
- **Triage.vue** - Interface de triage avec formulaire de saisie
- **EmergencyQueue.vue** - File d'attente des urgences avec priorités

### Laboratory (5 vues)
Composants : LabRequestForm, DataTable, formulaires de résultats

- **LabDashboard.vue** - Dashboard laboratoire avec stats
- **AnalysisList.vue** - Liste des analyses
- **AnalysisCreate.vue** - Nouvelle demande d'analyse (utilise LabRequestForm)
- **ResultsEntry.vue** - Saisie des résultats
- **ResultsValidation.vue** - Validation des résultats

### Imaging (4 vues)
- **ImagingDashboard.vue** - Dashboard imagerie
- **ExamsList.vue** - Liste des examens radiologiques
- **DicomViewer.vue** - Visualiseur DICOM pour images médicales
- **ReportCreate.vue** - Création de rapports radiologiques

### Hospitalization (4 vues)
- **BedsManagement.vue** - Gestion des lits avec statuts
- **AdmissionsList.vue** - Liste des hospitalisations
- **NursingCare.vue** - Soins infirmiers et observations
- **RoomOccupancy.vue** - Occupation des chambres (dashboard visuel)

### Physiotherapy (4 vues)
- **PhysioDashboard.vue** - Dashboard kinésithérapie
- **SessionsList.vue** - Liste des séances
- **SessionCreate.vue** - Nouvelle séance
- **ProgressTracking.vue** - Suivi de progression

### Pharmacy (4 vues)
- **PharmacyDashboard.vue** - Dashboard pharmacie avec stocks
- **Inventory.vue** - Gestion inventaire avec DataTable
- **Dispensing.vue** - Dispensation médicaments (utilise PrescriptionForm)
- **StockAlerts.vue** - Alertes de rupture de stock

### Surgery (3 vues)
- **SurgeryPlanning.vue** - Planification chirurgies avec calendrier
- **OperatingRooms.vue** - Gestion salles d'opération
- **SurgeryReports.vue** - Rapports opératoires

### Billing (5 vues)
- **BillingDashboard.vue** - Dashboard facturation avec revenus
- **InvoicesList.vue** - Liste factures
- **InvoiceCreate.vue** - Création facture
- **PaymentsList.vue** - Liste paiements (Orange Money, Wave, etc.)
- **InsuranceClaims.vue** - Réclamations assurance

### HR (4 vues)
- **EmployeesList.vue** - Liste employés
- **Scheduling.vue** - Planning horaires
- **Attendance.vue** - Gestion présences
- **Payroll.vue** - Gestion paie

### Reports (4 vues)
Utiliser LineChart, BarChart, PieChart pour visualisations

- **StatisticsDashboard.vue** - Dashboard statistiques générales
- **FinancialReports.vue** - Rapports financiers
- **MedicalReports.vue** - Rapports médicaux
- **CustomReports.vue** - Rapports personnalisés

### Settings (4 vues)
- **GeneralSettings.vue** - Paramètres généraux
- **UserManagement.vue** - Gestion utilisateurs
- **RolesPermissions.vue** - Gestion rôles et permissions
- **SystemConfig.vue** - Configuration système

## Template de Base pour Nouvelles Vues

```vue
<template>
  <div class="view-container">
    <div class="page-header">
      <div>
        <h1>Titre de la Page</h1>
        <p>Description</p>
      </div>
      <div class="header-actions">
        <!-- Actions buttons -->
      </div>
    </div>

    <div class="view-content">
      <!-- Content here -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  // Load data
});
</script>

<style scoped lang="scss">
.view-container {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h1 {
    margin: 0 0 4px;
    font-size: 28px;
    font-weight: 700;
    color: #111827;
  }

  p {
    margin: 0;
    color: #6b7280;
  }
}

.view-content {
  // Content styles
}
</style>
```

## Composants Disponibles

Les composants suivants sont disponibles pour construire les vues :

### Common
- AppHeader, AppSidebar, AppFooter, AppNotifications, AppBreadcrumb

### Charts
- LineChart, BarChart, PieChart, DoughnutChart

### Forms
- PatientForm, ConsultationForm, PrescriptionForm, LabRequestForm

### Tables
- DataTable, PatientsTable, AppointmentsTable

### Modals
- ConfirmModal, PatientDetailsModal, PrintModal

### Widgets
- StatsCard, PatientCard, CalendarWidget

## Routing

Assurez-vous de configurer les routes dans `router/index.ts` :

```typescript
const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/auth/login', component: () => import('@/views/auth/Login.vue') },
  { path: '/dashboard', component: () => import('@/views/dashboard/Dashboard.vue') },
  { path: '/patients', component: () => import('@/views/patients/PatientsList.vue') },
  // ... autres routes
];
```

## Stores Pinia Nécessaires

- authStore - Authentification
- patientStore - Gestion patients
- consultationStore - Consultations
- notificationStore - Notifications
- connectionStore - État connexion serveur

## Intégration Backend

Toutes les vues doivent utiliser les API endpoints du backend :
- Base URL: `http://localhost:3000/api/v1`
- Authentification: JWT via authStore
- WebSocket: `http://localhost:3000` (Socket.IO)
