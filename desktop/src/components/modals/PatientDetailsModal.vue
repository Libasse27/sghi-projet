<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="isVisible" class="modal-overlay" @click="handleClose">
        <div class="modal-container large" @click.stop>
          <div class="modal-header">
            <h3>Détails du Patient</h3>
            <button class="close-btn" @click="handleClose">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div v-if="patient" class="modal-body">
            <div class="patient-header">
              <div class="avatar-large">
                {{ patient.firstName?.charAt(0) }}{{ patient.lastName?.charAt(0) }}
              </div>
              <div class="patient-title">
                <h2>{{ patient.firstName }} {{ patient.lastName }}</h2>
                <div class="patient-meta">
                  <span class="badge">{{ patient.patientNumber }}</span>
                  <span class="separator">•</span>
                  <span>{{ calculateAge(patient.dateNaissance) }} ans</span>
                  <span class="separator">•</span>
                  <span>{{ patient.gender === 'M' ? 'Masculin' : 'Féminin' }}</span>
                </div>
              </div>
            </div>

            <div class="details-grid">
              <div class="details-section">
                <h4>
                  <i class="fas fa-user"></i>
                  Informations Personnelles
                </h4>
                <div class="details-content">
                  <div class="detail-row">
                    <span class="label">Date de Naissance:</span>
                    <span class="value">{{ formatDate(patient.dateNaissance) }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Groupe Sanguin:</span>
                    <span class="value blood-group">{{ patient.bloodGroup || '-' }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Carte d'Identité:</span>
                    <span class="value">{{ patient.nationalId || '-' }}</span>
                  </div>
                </div>
              </div>

              <div class="details-section">
                <h4>
                  <i class="fas fa-address-card"></i>
                  Contact
                </h4>
                <div class="details-content">
                  <div class="detail-row">
                    <span class="label">Téléphone:</span>
                    <span class="value">{{ patient.phone }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Email:</span>
                    <span class="value">{{ patient.email || '-' }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Adresse:</span>
                    <span class="value">{{ patient.address }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Ville:</span>
                    <span class="value">{{ patient.city || '-' }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Région:</span>
                    <span class="value">{{ patient.region || '-' }}</span>
                  </div>
                </div>
              </div>

              <div class="details-section">
                <h4>
                  <i class="fas fa-user-friends"></i>
                  Contact d'Urgence
                </h4>
                <div class="details-content">
                  <div class="detail-row">
                    <span class="label">Nom:</span>
                    <span class="value">{{ patient.emergencyContact || '-' }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Téléphone:</span>
                    <span class="value">{{ patient.emergencyPhone || '-' }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Relation:</span>
                    <span class="value">{{ patient.relationship || '-' }}</span>
                  </div>
                </div>
              </div>

              <div class="details-section">
                <h4>
                  <i class="fas fa-shield-alt"></i>
                  Assurance
                </h4>
                <div class="details-content">
                  <div class="detail-row">
                    <span class="label">Compagnie:</span>
                    <span class="value">{{ patient.insuranceProvider || 'Aucune' }}</span>
                  </div>
                  <div v-if="patient.insuranceProvider" class="detail-row">
                    <span class="label">Numéro:</span>
                    <span class="value">{{ patient.insuranceNumber || '-' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="showHistory" class="history-section">
              <h4>
                <i class="fas fa-history"></i>
                Historique Médical
              </h4>
              <div class="timeline">
                <div
                  v-for="(item, index) in medicalHistory"
                  :key="index"
                  class="timeline-item"
                >
                  <div class="timeline-marker"></div>
                  <div class="timeline-content">
                    <div class="timeline-date">{{ formatDate(item.date) }}</div>
                    <div class="timeline-title">{{ item.title }}</div>
                    <div class="timeline-description">{{ item.description }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" @click="handleClose">
              Fermer
            </button>
            <button class="btn-primary" @click="handleEdit">
              <i class="fas fa-edit"></i>
              Modifier
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { differenceInYears, format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Patient {
  id: string;
  patientNumber: string;
  firstName: string;
  lastName: string;
  dateNaissance: string;
  gender: 'M' | 'F';
  bloodGroup?: string;
  nationalId?: string;
  phone: string;
  email?: string;
  address: string;
  city?: string;
  region?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  relationship?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
}

const props = withDefaults(
  defineProps<{
    visible: boolean;
    patient?: Patient | null;
    showHistory?: boolean;
    medicalHistory?: any[];
  }>(),
  {
    showHistory: false,
    medicalHistory: () => [],
  }
);

const emit = defineEmits(['close', 'edit', 'update:visible']);

const isVisible = computed(() => props.visible);

const calculateAge = (dateOfBirth: string): number => {
  return differenceInYears(new Date(), new Date(dateOfBirth));
};

const formatDate = (date: string): string => {
  return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
};

const handleClose = () => {
  emit('close');
  emit('update:visible', false);
};

const handleEdit = () => {
  emit('edit', props.patient);
};
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  overflow-y: auto;
}

.modal-container {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #111827;
  }

  .close-btn {
    padding: 8px;
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    font-size: 18px;
    transition: color 0.2s;

    &:hover {
      color: #374151;
    }
  }
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.patient-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid #e5e7eb;

  .avatar-large {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb, #3b82f6);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 32px;
    flex-shrink: 0;
  }

  .patient-title {
    h2 {
      margin: 0 0 8px;
      font-size: 24px;
      font-weight: 700;
      color: #111827;
    }

    .patient-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #6b7280;

      .badge {
        padding: 4px 10px;
        background: #eff6ff;
        color: #2563eb;
        border-radius: 12px;
        font-weight: 600;
        font-size: 12px;
      }

      .separator {
        color: #d1d5db;
      }
    }
  }
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.details-section {
  h4 {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 0 16px;
    font-size: 16px;
    font-weight: 600;
    color: #374151;

    i {
      color: #2563eb;
    }
  }

  .details-content {
    background: #f9fafb;
    border-radius: 8px;
    padding: 16px;

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;

      &:last-child {
        border-bottom: none;
      }

      .label {
        font-size: 13px;
        color: #6b7280;
        font-weight: 500;
      }

      .value {
        font-size: 14px;
        color: #111827;
        font-weight: 500;
        text-align: right;

        &.blood-group {
          color: #dc2626;
          font-weight: 700;
        }
      }
    }
  }
}

.history-section {
  h4 {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 0 20px;
    font-size: 16px;
    font-weight: 600;
    color: #374151;

    i {
      color: #2563eb;
    }
  }

  .timeline {
    position: relative;
    padding-left: 24px;

    &::before {
      content: '';
      position: absolute;
      left: 4px;
      top: 8px;
      bottom: 8px;
      width: 2px;
      background: #e5e7eb;
    }

    .timeline-item {
      position: relative;
      margin-bottom: 20px;

      .timeline-marker {
        position: absolute;
        left: -24px;
        top: 4px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #2563eb;
        border: 2px solid white;
        box-shadow: 0 0 0 2px #e5e7eb;
      }

      .timeline-content {
        background: #f9fafb;
        padding: 12px;
        border-radius: 8px;

        .timeline-date {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .timeline-title {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
        }

        .timeline-description {
          font-size: 13px;
          color: #6b7280;
        }
      }
    }
  }
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  button {
    padding: 10px 24px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .btn-secondary {
    background: #f3f4f6;
    color: #374151;

    &:hover {
      background: #e5e7eb;
    }
  }

  .btn-primary {
    background: #2563eb;
    color: white;

    &:hover {
      background: #1d4ed8;
    }
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;

  .modal-container {
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;

  .modal-container {
    transform: scale(0.95);
    opacity: 0;
  }
}
</style>
