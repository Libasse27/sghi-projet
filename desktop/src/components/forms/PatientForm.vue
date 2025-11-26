<template>
  <form class="patient-form" @submit.prevent="handleSubmit">
    <div class="form-section">
      <h3 class="section-title">
        <i class="fas fa-user"></i>
        Informations Personnelles
      </h3>

      <div class="form-row">
        <div class="form-group">
          <label for="firstName">Prénom <span class="required">*</span></label>
          <input
            id="firstName"
            v-model="formData.firstName"
            type="text"
            required
            :class="{ error: errors.firstName }"
          />
          <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
        </div>

        <div class="form-group">
          <label for="lastName">Nom <span class="required">*</span></label>
          <input
            id="lastName"
            v-model="formData.lastName"
            type="text"
            required
            :class="{ error: errors.lastName }"
          />
          <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="dateOfBirth">Date de Naissance <span class="required">*</span></label>
          <input
            id="dateOfBirth"
            v-model="formData.dateOfBirth"
            type="date"
            required
            :max="maxDate"
            :class="{ error: errors.dateOfBirth }"
          />
          <span v-if="errors.dateOfBirth" class="error-message">{{ errors.dateOfBirth }}</span>
        </div>

        <div class="form-group">
          <label for="gender">Sexe <span class="required">*</span></label>
          <select
            id="gender"
            v-model="formData.gender"
            required
            :class="{ error: errors.gender }"
          >
            <option value="">Sélectionner</option>
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
          </select>
          <span v-if="errors.gender" class="error-message">{{ errors.gender }}</span>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="bloodGroup">Groupe Sanguin</label>
          <select id="bloodGroup" v-model="formData.bloodGroup">
            <option value="">Sélectionner</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div class="form-group">
          <label for="nationalId">Carte d'Identité</label>
          <input
            id="nationalId"
            v-model="formData.nationalId"
            type="text"
            placeholder="1-XXXX-XXXX-X-XX-XXXXX-XX"
          />
        </div>
      </div>
    </div>

    <div class="form-section">
      <h3 class="section-title">
        <i class="fas fa-address-card"></i>
        Contact
      </h3>

      <div class="form-row">
        <div class="form-group">
          <label for="phone">Téléphone <span class="required">*</span></label>
          <input
            id="phone"
            v-model="formData.phone"
            type="tel"
            required
            placeholder="+221 77 XXX XX XX"
            :class="{ error: errors.phone }"
          />
          <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="patient@example.com"
            :class="{ error: errors.email }"
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>
      </div>

      <div class="form-group">
        <label for="address">Adresse <span class="required">*</span></label>
        <textarea
          id="address"
          v-model="formData.address"
          rows="3"
          required
          :class="{ error: errors.address }"
        ></textarea>
        <span v-if="errors.address" class="error-message">{{ errors.address }}</span>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="city">Ville</label>
          <input id="city" v-model="formData.city" type="text" />
        </div>

        <div class="form-group">
          <label for="region">Région</label>
          <select id="region" v-model="formData.region">
            <option value="">Sélectionner</option>
            <option value="Dakar">Dakar</option>
            <option value="Thiès">Thiès</option>
            <option value="Saint-Louis">Saint-Louis</option>
            <option value="Diourbel">Diourbel</option>
            <option value="Louga">Louga</option>
            <option value="Kaolack">Kaolack</option>
            <option value="Fatick">Fatick</option>
            <option value="Kaffrine">Kaffrine</option>
            <option value="Kolda">Kolda</option>
            <option value="Matam">Matam</option>
            <option value="Sédhiou">Sédhiou</option>
            <option value="Tambacounda">Tambacounda</option>
            <option value="Kédougou">Kédougou</option>
            <option value="Ziguinchor">Ziguinchor</option>
          </select>
        </div>
      </div>
    </div>

    <div class="form-section">
      <h3 class="section-title">
        <i class="fas fa-user-friends"></i>
        Contact d'Urgence
      </h3>

      <div class="form-row">
        <div class="form-group">
          <label for="emergencyContact">Nom du Contact</label>
          <input
            id="emergencyContact"
            v-model="formData.emergencyContact"
            type="text"
          />
        </div>

        <div class="form-group">
          <label for="emergencyPhone">Téléphone</label>
          <input
            id="emergencyPhone"
            v-model="formData.emergencyPhone"
            type="tel"
            placeholder="+221 77 XXX XX XX"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="relationship">Relation</label>
        <input
          id="relationship"
          v-model="formData.relationship"
          type="text"
          placeholder="Ex: Père, Mère, Conjoint(e), etc."
        />
      </div>
    </div>

    <div class="form-section">
      <h3 class="section-title">
        <i class="fas fa-shield-alt"></i>
        Assurance
      </h3>

      <div class="form-row">
        <div class="form-group">
          <label for="insuranceProvider">Compagnie d'Assurance</label>
          <select id="insuranceProvider" v-model="formData.insuranceProvider">
            <option value="">Aucune</option>
            <option value="ALLIANZ">ALLIANZ</option>
            <option value="AXA">AXA</option>
            <option value="AMSA">AMSA</option>
            <option value="SONAM">SONAM</option>
            <option value="SALAMA">SALAMA</option>
            <option value="NSIA">NSIA</option>
            <option value="IPM">IPM</option>
          </select>
        </div>

        <div class="form-group">
          <label for="insuranceNumber">Numéro d'Assurance</label>
          <input
            id="insuranceNumber"
            v-model="formData.insuranceNumber"
            type="text"
            :disabled="!formData.insuranceProvider"
          />
        </div>
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
        <span v-else>{{ patient ? 'Mettre à Jour' : 'Enregistrer' }}</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';

interface Patient {
  id?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'M' | 'F' | '';
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

const props = defineProps<{
  patient?: Patient;
}>();

const emit = defineEmits(['submit', 'cancel']);

const isSubmitting = ref(false);
const maxDate = new Date().toISOString().split('T')[0];

const formData = reactive<Patient>({
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  bloodGroup: '',
  nationalId: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  region: '',
  emergencyContact: '',
  emergencyPhone: '',
  relationship: '',
  insuranceProvider: '',
  insuranceNumber: '',
});

const errors = reactive<Record<string, string>>({});

// Populate form if editing
watch(
  () => props.patient,
  (patient) => {
    if (patient) {
      Object.assign(formData, patient);
    }
  },
  { immediate: true }
);

const validateForm = (): boolean => {
  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key]);

  let isValid = true;

  // Required fields
  if (!formData.firstName.trim()) {
    errors.firstName = 'Le prénom est requis';
    isValid = false;
  }

  if (!formData.lastName.trim()) {
    errors.lastName = 'Le nom est requis';
    isValid = false;
  }

  if (!formData.dateOfBirth) {
    errors.dateOfBirth = 'La date de naissance est requise';
    isValid = false;
  }

  if (!formData.gender) {
    errors.gender = 'Le sexe est requis';
    isValid = false;
  }

  if (!formData.phone.trim()) {
    errors.phone = 'Le téléphone est requis';
    isValid = false;
  } else if (!/^(\+221)?[337][0357678]\d{7}$/.test(formData.phone.replace(/\s/g, ''))) {
    errors.phone = 'Numéro de téléphone invalide (format: +221 77 XXX XX XX)';
    isValid = false;
  }

  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Email invalide';
    isValid = false;
  }

  if (!formData.address.trim()) {
    errors.address = 'L\'adresse est requise';
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
.patient-form {
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
