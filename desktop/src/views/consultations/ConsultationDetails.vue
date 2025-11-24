<template>
  <div class="consultation-details" v-if="consultation">
    <a-page-header
      :title="`Consultation ${consultation.id}`"
      :sub-title="formatDateTime(consultation.date)"
      @back="() => $router.back()"
    >
      <template #extra>
        <a-space>
          <a-badge :status="getStatusBadge(consultation.status)" :text="getStatusText(consultation.status)" />
          <a-button @click="printConsultation">
            <template #icon><printer-outlined /></template>
            Imprimer
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <div class="details-content">
      <a-row :gutter="16">
        <a-col :span="16">
          <a-card title="Informations de la Consultation">
            <a-descriptions bordered :column="2">
              <a-descriptions-item label="Patient">
                <a @click="viewPatient">{{ consultation.patientNom }} {{ consultation.patientPrenom }}</a>
              </a-descriptions-item>
              <a-descriptions-item label="Médecin">{{ consultation.medecin }}</a-descriptions-item>
              <a-descriptions-item label="Date">{{ formatDateTime(consultation.date) }}</a-descriptions-item>
              <a-descriptions-item label="Type">{{ consultation.type }}</a-descriptions-item>
              <a-descriptions-item label="Motif" :span="2">{{ consultation.motif }}</a-descriptions-item>
            </a-descriptions>
          </a-card>

          <a-card title="Constantes Vitales" class="mt-3">
            <a-descriptions bordered :column="4">
              <a-descriptions-item label="Tension">{{ consultation.tension || '-' }}</a-descriptions-item>
              <a-descriptions-item label="Poids">{{ consultation.poids ? `${consultation.poids} kg` : '-' }}</a-descriptions-item>
              <a-descriptions-item label="Température">{{ consultation.temperature ? `${consultation.temperature}°C` : '-' }}</a-descriptions-item>
              <a-descriptions-item label="FC">{{ consultation.frequenceCardiaque ? `${consultation.frequenceCardiaque} bpm` : '-' }}</a-descriptions-item>
            </a-descriptions>
          </a-card>

          <a-card title="Diagnostic et Traitement" class="mt-3">
            <a-descriptions bordered>
              <a-descriptions-item label="Diagnostic" :span="3">
                {{ consultation.diagnostic || 'Non renseigné' }}
              </a-descriptions-item>
              <a-descriptions-item label="Prescription" :span="3">
                {{ consultation.prescription || 'Aucune prescription' }}
              </a-descriptions-item>
              <a-descriptions-item label="Notes" :span="3">
                {{ consultation.notes || 'Aucune note' }}
              </a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>

        <a-col :span="8">
          <a-card title="Actions">
            <a-space direction="vertical" style="width: 100%">
              <a-button block v-if="consultation.status === 'scheduled'" @click="startConsultation">
                <template #icon><play-circle-outlined /></template>
                Démarrer la Consultation
              </a-button>
              <a-button block v-if="consultation.status === 'in_progress'" type="primary" @click="completeConsultation">
                <template #icon><check-outlined /></template>
                Terminer la Consultation
              </a-button>
              <a-button block @click="newLabRequest">
                <template #icon><experiment-outlined /></template>
                Demande d'Analyse
              </a-button>
              <a-button block @click="newPrescription">
                <template #icon><medicine-box-outlined /></template>
                Prescription
              </a-button>
            </a-space>
          </a-card>

          <a-card title="Historique" class="mt-3">
            <a-timeline size="small">
              <a-timeline-item>Consultation créée</a-timeline-item>
              <a-timeline-item v-if="consultation.status !== 'scheduled'">Consultation démarrée</a-timeline-item>
              <a-timeline-item v-if="consultation.status === 'completed'">Consultation terminée</a-timeline-item>
            </a-timeline>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  PrinterOutlined,
  PlayCircleOutlined,
  CheckOutlined,
  ExperimentOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons-vue';
import dayjs from 'dayjs';

const router = useRouter();
const route = useRoute();

const consultation = ref({
  id: route.params.id || 'CONS-001',
  patientId: 'P-2024-001',
  patientNom: 'Diallo',
  patientPrenom: 'Amadou',
  medecin: 'Dr. Koné',
  date: new Date(),
  type: 'Consultation',
  motif: 'Contrôle de routine',
  status: 'scheduled',
  tension: '120/80',
  poids: 75,
  temperature: 37.2,
  frequenceCardiaque: 72,
  diagnostic: 'Patient en bonne santé générale',
  prescription: 'Aucune prescription nécessaire',
  notes: 'Revoir dans 6 mois',
});

const getStatusBadge = (status) => {
  const badges = {
    scheduled: 'default',
    in_progress: 'processing',
    completed: 'success',
    cancelled: 'error',
  };
  return badges[status] || 'default';
};

const getStatusText = (status) => {
  const texts = {
    scheduled: 'Planifiée',
    in_progress: 'En Cours',
    completed: 'Terminée',
    cancelled: 'Annulée',
  };
  return texts[status] || status;
};

const formatDateTime = (date) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
};

const viewPatient = () => {
  router.push(`/patients/${consultation.value.patientId}`);
};

const startConsultation = () => {
  consultation.value.status = 'in_progress';
};

const completeConsultation = () => {
  consultation.value.status = 'completed';
};

const newLabRequest = () => {
  router.push(`/laboratory/create?patientId=${consultation.value.patientId}`);
};

const newPrescription = () => {
  console.log('Nouvelle prescription');
};

const printConsultation = () => {
  console.log('Imprimer consultation');
};
</script>

<style scoped lang="scss">
.consultation-details {
  .details-content {
    padding: 24px;
  }

  .mt-3 {
    margin-top: 16px;
  }
}
</style>
