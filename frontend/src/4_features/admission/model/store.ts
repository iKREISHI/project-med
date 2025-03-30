import { create } from "zustand";
import { DoctorAppointment } from "@5_entities/doctorAppointment/model/model.ts";

type AppointmentFormStore = {
  appointment: Partial<DoctorAppointment>;
  setField: (key: keyof DoctorAppointment, value: string) => void;
  resetForm: () => void;
};

export const useAppointmentsFormStore = create<AppointmentFormStore>((set) => ({
  appointment: {},
  setField: (key, value) =>
    set((state) => ({ appointment: { ...state.appointment, [key]: value } })),
  resetForm: () => set({ appointment: {} }),
}));
