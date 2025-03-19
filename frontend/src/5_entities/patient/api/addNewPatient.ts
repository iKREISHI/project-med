import {NewPatient, Patient} from "../model/model.ts";
import {POST} from "../../../6_shared/api";


export const addNewPatient = async (
  patientData: Omit<Patient, "id" | "date_created">
): Promise<Patient> => {
  const response = await POST("/api/v0/patient/", {
    body: patientData,
  });
  return response.data; // Сервер вернёт полный `Patient`
};
