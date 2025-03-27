import {Employee} from "@5_entities/emloyee/model/model.ts";
import {POST} from "@6_shared/api";

export const addNewEmployee = async (
  employeeData: Omit<Employee, 'id' | 'data_created'>
): Promise<void> => {
  const response = await POST('/api/v0/employee/', {
    body: employeeData,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: пустой ответ от сервера");
  }

  return response.data;
}