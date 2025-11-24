<template>
  <div class="calendar-view">
    <a-page-header title="Calendrier des Consultations">
      <template #extra>
        <a-space>
          <a-button @click="$router.push('/consultations')">
            <template #icon><unordered-list-outlined /></template>
            Liste
          </a-button>
          <a-button type="primary" @click="$router.push('/consultations/create')">
            <template #icon><plus-outlined /></template>
            Nouvelle Consultation
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <div class="calendar-content">
      <a-card>
        <a-calendar :fullscreen="true" @select="onDateSelect">
          <template #dateCellRender="{ current }">
            <div class="date-cell">
              <div v-for="consultation in getConsultationsForDate(current)" :key="consultation.id" class="consultation-item">
                <a-badge :status="getStatusBadge(consultation.status)" :text="consultation.time" />
                <div class="consultation-patient">{{ consultation.patientNom }}</div>
              </div>
            </div>
          </template>
        </a-calendar>
      </a-card>
    </div>

    <!-- Modal de détails -->
    <a-modal
      v-model:open="showDetailsModal"
      :title="`Consultations du ${selectedDateFormatted}`"
      :footer="null"
      width="600px"
    >
      <a-list
        :data-source="selectedDateConsultations"
        item-layout="horizontal"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta
              :description="`${item.medecin} - ${item.motif}`"
            >
              <template #title>
                <a-space>
                  {{ item.time }}
                  <a-badge :status="getStatusBadge(item.status)" :text="getStatusText(item.status)" />
                </a-space>
              </template>
              <template #avatar>
                <a-avatar>{{ getInitials(item.patientNom, item.patientPrenom) }}</a-avatar>
              </template>
            </a-list-item-meta>
            <template #actions>
              <a @click="viewConsultation(item)">Voir</a>
            </template>
          </a-list-item>
        </template>
      </a-list>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  UnorderedListOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue';
import dayjs from 'dayjs';

const router = useRouter();
const showDetailsModal = ref(false);
const selectedDate = ref(null);

// Mock consultations
const consultations = ref([
  {
    id: 'CONS-001',
    patientId: 'P-2024-001',
    patientNom: 'Diallo',
    patientPrenom: 'Amadou',
    medecin: 'Dr. Koné',
    date: new Date(),
    time: '09:00',
    motif: 'Contrôle de routine',
    status: 'scheduled',
  },
  {
    id: 'CONS-002',
    patientId: 'P-2024-002',
    patientNom: 'Traoré',
    patientPrenom: 'Aïssata',
    medecin: 'Dr. Sanogo',
    date: new Date(),
    time: '10:30',
    motif: 'Céphalées persistantes',
    status: 'in_progress',
  },
  {
    id: 'CONS-003',
    patientId: 'P-2024-003',
    patientNom: 'Coulibaly',
    patientPrenom: 'Mamadou',
    medecin: 'Dr. Diabaté',
    date: new Date(Date.now() + 86400000),
    time: '14:00',
    motif: 'Suivi diabète',
    status: 'scheduled',
  },
]);

const selectedDateFormatted = computed(() => {
  return selectedDate.value ? dayjs(selectedDate.value).format('DD/MM/YYYY') : '';
});

const selectedDateConsultations = computed(() => {
  if (!selectedDate.value) return [];
  return getConsultationsForDate(selectedDate.value);
});

const getConsultationsForDate = (date) => {
  const dateStr = dayjs(date).format('YYYY-MM-DD');
  return consultations.value.filter((c) => {
    return dayjs(c.date).format('YYYY-MM-DD') === dateStr;
  });
};

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

const getInitials = (nom, prenom) => {
  return `${nom[0]}${prenom[0]}`.toUpperCase();
};

const onDateSelect = (date) => {
  const consultationsForDate = getConsultationsForDate(date);
  if (consultationsForDate.length > 0) {
    selectedDate.value = date;
    showDetailsModal.value = true;
  }
};

const viewConsultation = (consultation) => {
  router.push(`/consultations/${consultation.id}`);
};
</script>

<style scoped lang="scss">
.calendar-view {
  .calendar-content {
    padding: 24px;
  }

  .date-cell {
    .consultation-item {
      font-size: 12px;
      margin-bottom: 4px;
      padding: 2px 4px;
      background: #f0f2f5;
      border-radius: 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .consultation-patient {
        font-weight: 500;
        color: rgba(0, 0, 0, 0.65);
      }
    }
  }
}
</style>
