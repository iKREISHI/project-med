import { create } from "zustand";
import {Patient} from "../../../5_entities/patient";

type PatientFormStore = {
  patient: Partial<Patient>;
  setField: (key: keyof Patient, value: string) => void;
  resetForm: () => void;
};

export const usePatientFormStore = create<PatientFormStore>((set) => ({
  patient: {},
  setField: (key, value) =>
    set((state) => ({ patient: { ...state.patient, [key]: value } })),
  resetForm: () => set({ patient: {} }),
}));
