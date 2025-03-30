import {Employee} from "@5_entities/emloyee/model/model.ts";
import {POST} from "@6_shared/api";

export interface EmployeeRegistrationResponse {
  id: number;
  login: string;
  password: string;
}

export const addNewEmployee = async (
  employeeData: Omit<Employee, 'id' | 'data_created'>
) => { // Указываем возвращаемый тип
  const response = await POST('/api/v0/register-new-employee/', {
    body: {
      ...employeeData,
      is_django_user: true // добавляем фиксированное значение
    },
  });
  return response;
}