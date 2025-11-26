<template>
  <form class="lab-request-form" @submit.prevent="handleSubmit">
    <div class="form-section">
      <h3 class="section-title">
        <i class="fas fa-flask"></i>
        Demande d'Analyse
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
          <label for="doctor">Médecin Prescripteur <span class="required">*</span></label>
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
          <label for="date">Date de Demande <span class="required">*</span></label>
          <input id="date" v-model="formData.requestDate" type="date" required />
        </div>

        <div class="form-group">
          <label for="priority">Priorité <span class="required">*</span></label>
          <select id="priority" v-model="formData.priority" required>
            <option value="ROUTINE">Routine</option>
            <option value="URGENT">Urgent</option>
            <option value="STAT">STAT (Immédiat)</option>
          </select>
        </div>
      </div>
    </div>

    <div class="form-section">
      <h3 class="section-title">
        <i class="fas fa-vial"></i>
        Tests à Réaliser
      </h3>

      <div class="test-categories">
        <div class="category">
          <div class="category-header">
            <h4>
              <i class="fas fa-vials"></i>
              Hématologie
            </h4>
          </div>
          <div class="tests-grid">
            <label class="test-checkbox">
              <input type="checkbox" value="NFS" v-model="formData.tests" />
              <span>NFS (Numération Formule Sanguine)</span>
            </label>
            <label class="test-checkbox">
              <input type="checkbox" value="VS" v-model="formData.tests" />
              <span>VS (Vitesse de Sédimentation)</span>
            </label>
            <label class="test-checkbox">
              <input type="checkbox" value="TP-TCK" v-model="formData.tests" />
              <span>TP/TCK (Temps de Coagulation)</span>
            </label>
            <label class="test-checkbox">
              <input type="checkbox" value="GROUPAGE" v-model="formData.tests" />
              <span>Groupage Sanguin</span>
            </label>
          </div>
        </div>

        <div class="category">
          <div class="category-header">
            <h4>
              <i class="fas fa-heartbeat"></i>
              Biochimie
            </h4>
          </div>
          <div class="tests-grid">
            <label class="test-checkbox">
              <input type="checkbox" value="GLYCEMIE" v-model="formData.tests" />
              <span>Glycémie</span>
            </label>
            <label class="test-checkbox">
              <input type="checkbox" value="CREATININE" v-model="formData.tests" />
              <span>Créatinine</span>
            </label>
            <label class="test-checkbox">
              <input type="checkbox" value="TRANSAMINASES" v-model="formData.tests" />
              <span>Transaminases (ASAT/ALAT)</span>
            </label>
            <label class="test-checkbox">
              <input type="checkbox" value="CHOLESTEROL" v-model="formData.tests" />
              <span>Bilan Lipidique</span>
            </label>
          </div>
        </div>

        <div class="category">
          <div class="category-header">
            <h4>
              <i class="fas fa-bacteria"></i>
              Microbiologie
            </h4>
          </div>
          <div class="tests-grid">
            <label class="test-checkbox">
              <input type="checkbox" value="ECBU" v-model="formData.tests" />
              <span>ECBU (Examen Cytobactériologique Urine)</span>
            </label>
            <label class="test-checkbox">
              <input type="checkbox" value="COPROCULTURE" v-model="formData.tests" />
              <span>Coproculture</span>
            </label>
            <label class="test-checkbox">
              <input type="checkbox" value="HEMOCULTURE" v-model="formData.tests" />
              <span>Hémoculture</span>
            </label>
          </div>
        </div>

        <div class="category">
          <div class="category-header">
            <h4>
              <i class="fas fa-syringe"></i>
              Sérologie
            </h4>
          </div>
          <div class="tests-grid">
            <label class="test-checkbox">
              <input type="checkbox" value="HIV" v-model="formData.tests" />
              <span>Sérologie VIH</span>
            </label>
            <label class="test-checkbox">
              <input type="checkbox" value="HEPATITE-B" v-model="formData.tests" />
              <span>Hépatite B</span>
            </label>
            <label class="test-checkbox">
              <input type="checkbox" value="HEPATITE-C" v-model="formData.tests" />
              <span>Hépatite C</span>
            </label>
            <label class="test-checkbox">
              <input type="checkbox" value="COVID-19" v-model="formData.tests" />
              <span>COVID-19</span>
            </label>
          </div>
        </div>
      </div>

      <div class="form-group" style="margin-top: 16px;">
        <label for="otherTests">Autres Tests</label>
        <input
          id="otherTests"
          v-model="formData.otherTests"
          type="text"
          placeholder="Spécifiez d'autres tests non listés..."
        />
      </div>
    </div>

    <div class="form-section">
      <h3 class="section-title">
        <i class="fas fa-info-circle"></i>
        Informations Complémentaires
      </h3>

      <div class="form-group">
        <label for="clinicalInfo">Informations Cliniques</label>
        <textarea
          id="clinicalInfo"
          v-model="formData.clinicalInfo"
          rows="3"
          placeholder="Diagnostic présumé, symptômes, etc..."
        ></textarea>
      </div>

      <div class="form-group">
        <label for="notes">Notes</label>
        <textarea
          id="notes"
          v-model="formData.notes"
          rows="2"
          placeholder="Notes supplémentaires..."
        ></textarea>
      </div>
    </div>

    <div class="form-actions">
      <button type="button" class="btn-cancel" @click="handleCancel">
        <i class="fas fa-times"></i>
        Annuler
      </button>
      <button type="submit" class="btn-submit" :disabled="isSubmitting || formData.tests.length === 0">
        <i class="fas fa-check"></i>
        <span v-if="isSubmitting">Enregistrement...</span>
        <span v-else>{{ isEditing ? 'Mettre à Jour' : 'Créer la Demande' }}</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';

interface LabRequest {
  id?: string;
  patientId: string;
  doctorId: string;
  requestDate: string;
  priority: string;
  tests: string[];
  otherTests?: string;
  clinicalInfo?: string;
  notes?: string;
}

const props = defineProps<{
  labRequest?: LabRequest;
  patients?: any[];
  doctors?: any[];
}>();

const emit = defineEmits(['submit', 'cancel']);

const isSubmitting = ref(false);
const isEditing = computed(() => !!props.labRequest?.id);

const formData = reactive<LabRequest>({
  patientId: '',
  doctorId: '',
  requestDate: new Date().toISOString().split('T')[0],
  priority: 'ROUTINE',
  tests: [],
  otherTests: '',
  clinicalInfo: '',
  notes: '',
});

watch(
  () => props.labRequest,
  (labRequest) => {
    if (labRequest) {
      Object.assign(formData, labRequest);
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  if (formData.tests.length === 0 && !formData.otherTests) {
    alert('Veuillez sélectionner au moins un test');
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
.lab-request-form {
  background: white;
  border-radius: 8px;
  padding: 24px;
}

.form-section {
  margin-bottom: 32px;

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

.test-categories {
  display: grid;
  gap: 20px;

  .category {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;

    .category-header {
      margin-bottom: 12px;

      h4 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: #374151;
        display: flex;
        align-items: center;
        gap: 8px;

        i {
          color: #2563eb;
        }
      }
    }

    .tests-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 12px;

      .test-checkbox {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-size: 13px;
        color: #374151;

        input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        &:hover {
          color: #111827;
        }
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
