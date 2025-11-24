import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Patient {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: 'M' | 'F';
  telephone: string;
  email?: string;
  adresse?: string;
  groupeSanguin?: string;
}

interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PatientState = {
  patients: [],
  selectedPatient: null,
  isLoading: false,
  error: null,
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setPatients: (state, action: PayloadAction<Patient[]>) => {
      state.patients = action.payload;
    },
    setSelectedPatient: (state, action: PayloadAction<Patient | null>) => {
      state.selectedPatient = action.payload;
    },
    addPatient: (state, action: PayloadAction<Patient>) => {
      state.patients.unshift(action.payload);
    },
    updatePatient: (state, action: PayloadAction<Patient>) => {
      const index = state.patients.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = action.payload;
      }
    },
    removePatient: (state, action: PayloadAction<string>) => {
      state.patients = state.patients.filter(p => p.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
  },
});

export const {
  setPatients,
  setSelectedPatient,
  addPatient,
  updatePatient,
  removePatient,
  setLoading,
  setError,
  clearError,
} = patientSlice.actions;

export default patientSlice.reducer;
