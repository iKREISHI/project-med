// @ts-nocheck
import { POST } from "@6_shared/api";

export const getAiResponse = async (appointmentData) => {
  const payload = {
    booking_appointment: appointmentData.booking_appointment ||1,
    patient: appointmentData.patient || 0,
    reception_template: appointmentData.reception_template || 1,
    reception_document: appointmentData.reception_document || '',
    reception_document_fields: JSON.stringify(appointmentData.reception_document_fields || {}),
    assigned_doctor: appointmentData.assigned_doctor || 0,
    signed_by: appointmentData.signed_by || 0,
    is_first_appointment: appointmentData.is_first_appointment || false,
    is_closed: appointmentData.is_closed || false,
    reason_for_inspection: appointmentData.reason_for_inspection || '',
    inspection_choice: appointmentData.inspection_choice || 'no_inspection',
    appointment_date: appointmentData.appointment_date || '',
    start_time: appointmentData.start_time || '',
    end_time: appointmentData.end_time || '',
    medical_card: appointmentData.medical_card || 1,
    diagnosis: appointmentData.diagnosis || 1,
  };

  const response = await POST('/api/v0/ai-recommendation/doctor-appointment/ai-response/', {
    body: payload,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка получения ответа от ИИ");
  }

  return response.data;
};
