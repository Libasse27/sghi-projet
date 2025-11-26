<template>
  <form class="consultation-form" @submit.prevent="handleSubmit">
    <div class="form-section">
      <h3 class="section-title">
        <i class="fas fa-info-circle"></i>
        Informations Générales
      </h3>

      <div class="form-row">
        <div class="form-group">
          <label for="patient">Patient <span class="required">*</span></label>
          <select
            id="patient"
            v-model="formData.patientId"
            required
            :class="{ error: errors.patientId }"
            :disabled="isEditing"
          >
            <option value="">Sélectionner un patient</option>
            <option v-for="patient in patients" :key="patient.id" :value="patient.id">
              {{ patient.firstName }} {{ patient.lastName }} - {{ patient.patientNumber }}
            </option>
          </select>
          <span v-if="errors.patientId" class="error-message">{{ errors.patientId }}</span>
        </div>

        <div class="form-group">
          <label for="doctor">Médecin <span class="required">*</span></label>
          <select
            id="doctor"
            v-model="formData.doctorId"
            required
            :class="{ error: errors.doctorId }"
          >
            <option value="">Sélectionner un médecin</option>
            <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
              Dr. {{ doctor.firstName }} {{ doctor.lastName }} - {{ doctor.specialty }}
            </option>
          </select>
          <span v-if="errors.doctorId" class="error-message">{{ errors.doctorId }}</span>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="type">Type de Consultation <span class="required">*</span></label>
          <select
            id="type"
            v-model="formData.type"
            required
            :class="{ error: errors.type }"
          >
            <option value="">Sélectionner</option>
            <option value="GENERAL">Consultation Générale</option>
            <option value="SPECIALIST">Consultation Spécialisée</option>
            <option value="FOLLOWUP">Suivi</option>
            <option value="EMERGENCY">Urgence</option>
          </select>
          <span v-if="errors.type" class="error-message">{{ errors.type }}</span>
        </div>

        <div class="form-group">
          <label for="date">Date <span class="required">*</span></label>
          <input
            id="date"
            v-model="formData.date"
            type="datetime-local"
            required
            :class="{ error: errors.date }"
          />
          <span v-if="errors.date" class="error-message">{{ errors.date }}</span>
        </div>
      </div>
    </div>

    <div class="form-section">
      <h3 class="section-title">
        <i class="fas fa-heartbeat"></i>
        Signes Vitaux
      </h3>

      <div class="form-row">
        <div class="form-group">
          <label for="temperature">Température (°C)</label>
          <input
            id="temperature"
            v-model.number="formData.vitalSigns.temperature"
            type="number"
            step="0.1"
            placeholder="37.0"
          />
        </div>

        <div class="form-group">
          <label for="bloodPressure">Tension Artérielle</label>
          <input
            id="bloodPressure"
            v-model="formData.vitalSigns.bloodPressure"
            type="text"
            placeholder="120/80"
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="heartRate">Fréquence Cardiaque (bpm)</label>
          <input
            id="heartRate"
            v-model.number="formData.vitalSigns.heartRate"
            type="number"
            placeholder="70"
          />
        </div>

        <div class="form-group">
          <label for="weight">Poids (kg)</label>
          <input
            id="weight"
            v-model.number="formData.vitalSigns.weight"
            type="number"
            step="0.1"
            placeholder="70.0"
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="height">Taille (cm)</label>
          <input
            id="height"
            v-model.number="formData.vitalSigns.height"
            type="number"
            placeholder="170"
          />
        </div>

        <div class="form-group">
          <label for="oxygenSaturation">Saturation en O2 (%)</label>
          <input
            id="oxygenSaturation"
            v-model.number="formData.vitalSigns.oxygenSaturation"
            type="number"
            placeholder="98"
          />
        </div>
      </div>
    </div>

    <div class="form-section">
      <h3 class="section-title">
        <i class="fas fa-notes-medical"></i>
        Informations Médicales
      </h3>

      <div class="form-group">
        <label for="chiefComplaint">Motif de Consultation <span class="required">*</span></label>
        <textarea
          id="chiefComplaint"
          v-model="formData.chiefComplaint"
          rows="3"
          required
          placeholder="Décrivez le motif principal de la consultation..."
          :class="{ error: errors.chiefComplaint }"
        ></textarea>
        <span v-if="errors.chiefComplaint" class="error-message">{{ errors.chiefComplaint }}</span>
      </div>

      <div class="form-group">
        <label for="history">Anamnèse</label>
        <textarea
          id="history"
          v-model="formData.history"
          rows="4"
          placeholder="Histoire de la maladie, symptômes, antécédents pertinents..."
        ></textarea>
      </div>

      <div class="form-group">
        <label for="examination">Examen Clinique</label>
        <textarea
          id="examination"
          v-model="formData.examination"
          rows="4"
          placeholder="Résultats de l'examen physique..."
        ></textarea>
      </div>

      <div class="form-group">
        <label for="diagnosis">Diagnostic</label>
        <textarea
          id="diagnosis"
          v-model="formData.diagnosis"
          rows="3"
          placeholder="Diagnostic principal et différentiels..."
        ></textarea>
      </div>

      <div class="form-group">
        <label for="treatment">Plan de Traitement</label>
        <textarea
          id="treatment"
          v-model="formData.treatment"
          rows="4"
          placeholder="Prescriptions, recommandations, examens complémentaires..."
        ></textarea>
      </div>

      <div class="form-group">
        <label for="notes">Notes Supplémentaires</label>
        <textarea
          id="notes"
          v-model="formData.notes"
          rows="3"
          placeholder="Notes additionnelles..."
        ></textarea>
      </div>
    </div>

    <div class="form-section">
      <h3 class="section-title">
        <i class="fas fa-calendar-plus"></i>
        Suivi
      </h3>

      <div class="form-group">
        <label>
          <input type="checkbox" v-model="formData.requiresFollowup" />
          <span>Nécessite un suivi</span>
        </label>
      </div>

      <div v-if="formData.requiresFollowup" class="form-group">
        <label for="followupDate">Date de Suivi Recommandée</label>
        <input
          id="followupDate"
          v-model="formData.followupDate"
          type="date"
          :min="new Date().toISOString().split('T')[0]"
        />
      </div>
    </div>

    <div class="form-actions">
      <button type="button" class="btn-cancel" @click="handleCancel">
        <i class="fas fa-times"></i>
        Annuler
      </button>
      <button type="submit" class="btn-submit" :disabled="isSubmitting">
        <i class="fas fa-check"></i>
        <span v-if="isSubmitting">Enregistrement...</span>
        <span v-else>{{ isEditing ? 'Mettre à Jour' : 'Enregistrer' }}</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';

interface VitalSigns {
  temperature?: number;
  bloodPressure?: string;
  heartRate?: number;
  weight?: number;
  height?: number;
  oxygenSaturation?: number;
}

interface Consultation {
  id?: string;
  patientId: string;
  doctorId: string;
  type: string;
  date: string;
  chiefComplaint: string;
  history?: string;
  examination?: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  vitalSigns: VitalSigns;
  requiresFollowup: boolean;
  followupDate?: string;
}

const props = defineProps<{
  consultation?: Consultation;
  patients?: any[];
  doctors?: any[];
}>();

const emit = defineEmits(['submit', 'cancel']);

const isSubmitting = ref(false);
const isEditing = computed(() => !!props.consultation?.id);

const formData = reactive<Consultation>({
  patientId: '',
  doctorId: '',
  type: '',
  date: new Date().toISOString().slice(0, 16),
  chiefComplaint: '',
  history: '',
  examination: '',
  diagnosis: '',
  treatment: '',
  notes: '',
  vitalSigns: {},
  requiresFollowup: false,
  followupDate: '',
});

const errors = reactive<Record<string, string>>({});

// Populate form if editing
watch(
  () => props.consultation,
  (consultation) => {
    if (consultation) {
      Object.assign(formData, consultation);
    }
  },
  { immediate: true }
);

const validateForm = (): boolean => {
  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key]);

  let isValid = true;

  if (!formData.patientId) {
    errors.patientId = 'Veuillez sélectionner un patient';
    isValid = false;
  }

  if (!formData.doctorId) {
    errors.doctorId = 'Veuillez sélectionner un médecin';
    isValid = false;
  }

  if (!formData.type) {
    errors.type = 'Veuillez sélectionner un type de consultation';
    isValid = false;
  }

  if (!formData.date) {
    errors.date = 'La date est requise';
    isValid = false;
  }

  if (!formData.chiefComplaint.trim()) {
    errors.chiefComplaint = 'Le motif de consultation est requis';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    emit('submit', formData);
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<style scoped lang="scss">
.consultation-form {
  background: white;
  border-radius: 8px;
  padding: 24px;
}

.form-section {
  margin-bottom: 32px;

  &:last-of-type {
    margin-bottom: 24px;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 0 20px;
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    padding-bottom: 12px;
    border-bottom: 2px solid #e5e7eb;

    i {
      color: #2563eb;
    }
  }
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;

    &:has(input[type="checkbox"]) {
      flex-direction: row;
      align-items: center;
      gap: 8px;
      cursor: pointer;

      input[type="checkbox"] {
        width: auto;
        margin: 0;
      }
    }

    .required {
      color: #ef4444;
    }
  }

  input,
  select,
  textarea {
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    font-family: inherit;
    color: #111827;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    &:disabled {
      background: #f3f4f6;
      color: #9ca3af;
      cursor: not-allowed;
    }

    &.error {
      border-color: #ef4444;

      &:focus {
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }
    }
  }

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }

  .error-message {
    font-size: 12px;
    color: #ef4444;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;

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

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .btn-cancel {
    background: #f3f4f6;
    color: #374151;

    &:hover:not(:disabled) {
      background: #e5e7eb;
    }
  }

  .btn-submit {
    background: #2563eb;
    color: white;

    &:hover:not(:disabled) {
      background: #1d4ed8;
    }
  }
}
</style>
