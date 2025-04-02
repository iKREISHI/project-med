import { GET } from "@6_shared/api";
import { Patient } from "@5_entities/patient";

//Получение одного ПАЦИЕНТА по его id
export const getPatient = async (patientId: number): Promise<Patient> => {
  const response = await GET("/api/v0/patient/{id}/", {
    params: {
      path: { id: patientId },
      query: undefined,
      header: undefined,
      cookie: undefined
    }
  });

  if (!response.data) {
    throw new Error("Пациент не найден");
  }
  console.log(response.data);
  return response.data as Patient;
};