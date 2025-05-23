// @ts-nocheck
// @ts-nocheck
export type { Patient } from './model/model.ts'
export type { PaginatedPatientList } from './model/model.ts'
export type { PatientListQueryParams } from './model/model.ts'
//export type { NewPatient } from './model/model.ts'
export { getAllPatients } from './api/getAllPatients.ts'
export { deletePatient } from './api/deletePatient.ts'
export { updatePatient } from './api/updatePatient.ts'
export { getPatient } from './api/getPatient.ts'