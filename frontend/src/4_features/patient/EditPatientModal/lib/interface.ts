export interface EditPatientModalProps {
  open: boolean;
  onClose: () => void;
  patientId: number | null;
  onUpdate: () => void;
}

