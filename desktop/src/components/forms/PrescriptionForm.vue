<template>
  <form class="prescription-form" @submit.prevent="handleSubmit">
    <div class="form-section">
      <h3 class="section-title">
        <i class="fas fa-prescription"></i>
        Informations de l'Ordonnance
      </h3>

      <div class="form-row">
        <div class="form-group">
          <label for="patient">Patient <span class="required">*</span></label>
          <select id="patient" v-model="formData.patientId" required :disabled="isEditing">
            <option value="">Sélectionner un patient</option>
            <option v-for="patient in patients" :key="patient.id" :value="patient.id">
              {{ patient.firstName }} {{ patient.lastName }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="doctor">Médecin <span class="required">*</span></label>
          <select id="doctor" v-model="formData.doctorId" required>
            <option value="">Sélectionner un médecin</option>
            <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
              Dr. {{ doctor.firstName }} {{ doctor.lastName }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="date">Date <span class="required">*</span></label>
          <input id="date" v-model="formData.date" type="date" required />
        </div>

        <div class="form-group">
          <label for="diagnosis">Diagnostic</label>
          <input id="diagnosis" v-model="formData.diagnosis" type="text" />
        </div>
      </div>
    </div>

    <div class="form-section">
      <div class="section-header">
        <h3 class="section-title">
          <i class="fas fa-pills"></i>
          Médicaments
        </h3>
        <button type="button" class="btn-add" @click="addMedication">
          <i class="fas fa-plus"></i>
          Ajouter un médicament
        </button>
      </div>

      <div v-if="formData.medications.length === 0" class="empty-state">
        <i class="fas fa-pills"></i>
        <p>Aucun médicament ajouté</p>
      </div>

      <div v-for="(medication, index) in formData.medications" :key="index" class="medication-item">
        <div class="medication-header">
          <span class="medication-number">Médicament {{ index + 1 }}</span>
          <button type="button" class="btn-remove" @click="removeMedication(index)">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Nom du Médicament <span class="required">*</span></label>
            <input v-model="medication.name" type="text" required placeholder="Ex: Paracétamol" />
          </div>

          <div class="form-group">
            <label>Dosage <span class="required">*</span></label>
            <input v-model="medication.dosage" type="text" required placeholder="Ex: 500mg" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Fréquence <span class="required">*</span></label>
            <input v-model="medication.frequency" type="text" required placeholder="Ex: 3 fois par jour" />
          </div>

          <div class="form-group">
            <label>Durée <span class="required">*</span></label>
            <input v-model="medication.duration" type="text" required placeholder="Ex: 7 jours" />
          </div>
        </div>

        <div class="form-group">
          <label>Instructions</label>
          <textarea v-model="medication.instructions" rows="2" placeholder="Ex: Prendre après les repas"></textarea>
        </div>
      </div>
    </div>

    <div class="form-section">
      <h3 class="section-title">
        <i class="fas fa-comment-medical"></i>
        Instructions Générales
      </h3>

      <div class="form-group">
        <label for="generalInstructions">Instructions</label>
        <textarea
          id="generalInstructions"
          v-model="formData.generalInstructions"
          rows="4"
          placeholder="Instructions générales pour le patient..."
        ></textarea>
      </div>

      <div class="form-group">
        <label for="notes">Notes</label>
        <textarea id="notes" v-model="formData.notes" rows="3" placeholder="Notes supplémentaires..."></textarea>
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

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

interface Prescription {
  id?: string;
  patientId: string;
  doctorId: string;
  date: string;
  diagnosis?: string;
  medications: Medication[];
  generalInstructions?: string;
  notes?: string;
}

const props = defineProps<{
  prescription?: Prescription;
  patients?: any[];
  doctors?: any[];
}>();

const emit = defineEmits(['submit', 'cancel']);

const isSubmitting = ref(false);
const isEditing = computed(() => !!props.prescription?.id);

const formData = reactive<Prescription>({
  patientId: '',
  doctorId: '',
  date: new Date().toISOString().split('T')[0],
  diagnosis: '',
  medications: [],
  generalInstructions: '',
  notes: '',
});

watch(
  () => props.prescription,
  (prescription) => {
    if (prescription) {
      Object.assign(formData, prescription);
    }
  },
  { immediate: true }
);

const addMedication = () => {
  formData.medications.push({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
  });
};

const removeMedication = (index: number) => {
  formData.medications.splice(index, 1);
};

const handleSubmit = async () => {
  if (formData.medications.length === 0) {
    alert('Veuillez ajouter au moins un médicament');
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
.prescription-form {
  background: white;
  border-radius: 8px;
  padding: 24px;
}

.form-section {
  margin-bottom: 32px;

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
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

  .btn-add {
    padding: 8px 16px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background 0.2s;

    &:hover {
      background: #1d4ed8;
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  color: #9ca3af;

  i {
    font-size: 48px;
    margin-bottom: 12px;
  }

  p {
    margin: 0;
  }
}

.medication-item {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;

  .medication-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .medication-number {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
    }

    .btn-remove {
      padding: 6px 12px;
      background: #fee2e2;
      color: #dc2626;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      transition: background 0.2s;

      &:hover {
        background: #fecaca;
      }
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
  }

  textarea {
    resize: vertical;
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
