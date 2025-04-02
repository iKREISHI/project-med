import { create } from "zustand";
import { PatientCondition } from "@5_entities/patientCondition";

type PatientConditionFormStore = {
  pCondition: Partial<PatientCondition>;
  setField: (key: keyof PatientCondition, value: string) => void;
  resetForm: () => void;
};

export const usePatientConditionFormStore = create<PatientConditionFormStore>((set) => ({
  pCondition: {},
  setField: (key, value) =>
    set((state) => ({ pCondition: { ...state.pCondition, [key]: value } })),
  resetForm: () => set({ pCondition: {} }),
}));
