<template>
  <div class="patient-card" @click="handleClick">
    <div class="card-header">
      <div class="avatar">
        {{ patient.firstName?.charAt(0) }}{{ patient.lastName?.charAt(0) }}
      </div>

      <div class="patient-info">
        <h4>{{ patient.firstName }} {{ patient.lastName }}</h4>
        <p class="patient-number">{{ patient.patientNumber }}</p>
      </div>

      <div v-if="showMenu" class="card-menu" @click.stop>
        <button class="menu-trigger" @click="toggleMenu">
          <i class="fas fa-ellipsis-v"></i>
        </button>

        <transition name="menu-fade">
          <div v-if="menuOpen" class="menu-dropdown">
            <button @click="handleEdit">
              <i class="fas fa-edit"></i>
              Modifier
            </button>
            <button @click="handleDelete">
              <i class="fas fa-trash-alt"></i>
              Supprimer
            </button>
          </div>
        </transition>
      </div>
    </div>

    <div class="card-body">
      <div class="info-row">
        <span class="label">
          <i class="fas fa-birthday-cake"></i>
          Âge
        </span>
        <span class="value">{{ calculateAge(patient.dateNaissance) }} ans</span>
      </div>

      <div class="info-row">
        <span class="label">
          <i class="fas fa-venus-mars"></i>
          Sexe
        </span>
        <span class="value">{{ patient.gender === 'M' ? 'Masculin' : 'Féminin' }}</span>
      </div>

      <div class="info-row">
        <span class="label">
          <i class="fas fa-phone"></i>
          Téléphone
        </span>
        <span class="value">{{ patient.phone }}</span>
      </div>

      <div v-if="patient.bloodGroup" class="info-row">
        <span class="label">
          <i class="fas fa-tint"></i>
          Groupe Sanguin
        </span>
        <span class="value blood-group">{{ patient.bloodGroup }}</span>
      </div>

      <div v-if="showLastVisit && patient.lastVisit" class="info-row">
        <span class="label">
          <i class="fas fa-calendar"></i>
          Dernière Visite
        </span>
        <span class="value">{{ formatDate(patient.lastVisit) }}</span>
      </div>
    </div>

    <div v-if="showActions" class="card-footer">
      <button class="action-btn primary" @click.stop="handleConsultation">
        <i class="fas fa-stethoscope"></i>
        Consultation
      </button>
      <button class="action-btn secondary" @click.stop="handleDetails">
        <i class="fas fa-eye"></i>
        Détails
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { differenceInYears, format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Patient {
  id: string;
  patientNumber: string;
  firstName: string;
  lastName: string;
  dateNaissance: string;
  gender: 'M' | 'F';
  phone: string;
  bloodGroup?: string;
  lastVisit?: string;
}

const props = withDefaults(
  defineProps<{
    patient: Patient;
    showMenu?: boolean;
    showActions?: boolean;
    showLastVisit?: boolean;
  }>(),
  {
    showMenu: true,
    showActions: true,
    showLastVisit: true,
  }
);

const emit = defineEmits(['click', 'edit', 'delete', 'consultation', 'details']);

const menuOpen = ref(false);

const calculateAge = (dateOfBirth: string): number => {
  return differenceInYears(new Date(), new Date(dateOfBirth));
};

const formatDate = (date: string): string => {
  return format(new Date(date), 'dd/MM/yyyy', { locale: fr });
};

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const handleClick = () => {
  emit('click', props.patient);
};

const handleEdit = () => {
  menuOpen.value = false;
  emit('edit', props.patient);
};

const handleDelete = () => {
  menuOpen.value = false;
  emit('delete', props.patient);
};

const handleConsultation = () => {
  emit('consultation', props.patient);
};

const handleDetails = () => {
  emit('details', props.patient);
};
</script>

<style scoped lang="scss">
.patient-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}

.card-header {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #e5e7eb;
  position: relative;

  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb, #3b82f6);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 18px;
    flex-shrink: 0;
  }

  .patient-info {
    flex: 1;

    h4 {
      margin: 0 0 4px;
      font-size: 16px;
      font-weight: 600;
      color: #111827;
    }

    .patient-number {
      margin: 0;
      font-size: 12px;
      font-family: monospace;
      color: #6b7280;
      font-weight: 600;
    }
  }

  .card-menu {
    position: relative;

    .menu-trigger {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: none;
      border: none;
      color: #6b7280;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;

      &:hover {
        background: #f3f4f6;
        color: #374151;
      }
    }

    .menu-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 8px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 10;
      min-width: 150px;
      overflow: hidden;

      button {
        width: 100%;
        padding: 10px 16px;
        background: none;
        border: none;
        text-align: left;
        font-size: 14px;
        color: #374151;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: background 0.2s;

        &:hover {
          background: #f9fafb;
        }

        i {
          width: 16px;
        }
      }
    }
  }
}

.card-body {
  padding: 16px 20px;

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f3f4f6;

    &:last-child {
      border-bottom: none;
    }

    .label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #6b7280;

      i {
        width: 16px;
        text-align: center;
        color: #9ca3af;
      }
    }

    .value {
      font-size: 14px;
      font-weight: 500;
      color: #111827;

      &.blood-group {
        color: #dc2626;
        font-weight: 700;
      }
    }
  }
}

.card-footer {
  padding: 16px 20px;
  background: #f9fafb;
  display: flex;
  gap: 8px;

  .action-btn {
    flex: 1;
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.2s;

    &.primary {
      background: #2563eb;
      color: white;

      &:hover {
        background: #1d4ed8;
      }
    }

    &.secondary {
      background: white;
      color: #374151;
      border: 1px solid #d1d5db;

      &:hover {
        background: #f9fafb;
      }
    }
  }
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
