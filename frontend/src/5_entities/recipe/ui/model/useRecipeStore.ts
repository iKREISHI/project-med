// @ts-nocheck
import { create } from "zustand";

interface Prescription {
  id?: string;
  patientFullName: string;
  patientBirthDate: string;
  diagnosisCode: string;
  medicationName: string;
  tradeName: string;
  medicationForm: string;
  dosage: string;
  quantity: string;
  usageInstructions: string;
  doctorFullName: string;
  prescriptionDate: string;
  validityPeriod: string;
  isElectronic?: boolean;
}

type RecipeStore = {
  prescription: Partial<Prescription>;
  setField: <K extends keyof Prescription>(key: K, value: Prescription[K]) => void;
  resetForm: () => void;
  setPrescription: (prescription: Partial<Prescription>) => void;
};

export const useRecipeStore = create<RecipeStore>((set) => ({
  prescription: {},
  setField: (key, value) =>
    set((state) => ({ 
      prescription: { ...state.prescription, [key]: value } 
    })),
  resetForm: () => set({ prescription: {} }),
  setPrescription: (prescription) => set({ prescription }),
}));