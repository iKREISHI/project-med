import { FC } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Chat } from "@1_pages/chat";
import { DashBoard } from "@1_pages/dashboard";
import { Registry } from "@1_pages/registry";
import { Main } from "@1_pages/main";
import { Login } from "@1_pages/login"
import { Patient } from "@6_shared/Patient";
import { PatientInfo } from "@6_shared/PatientInfo";
import { PatientAddresses } from "@6_shared/Addresses";
import { PatientPassport } from "@6_shared/Passport";
import { MedicalData } from "@6_shared/MedicalData";
import { Admission } from "@1_pages/admission";
import { Record } from "@1_pages/record";
import { TreatmentPlan } from "@6_shared/TreatmentPlan";
import { Diagnosis } from "@6_shared/Diagnosis";
import { PatientAddForm } from "@4_features/patient/RegisterAddForm";
import { ProtectedRoute } from "./ProtectedRoute";
import { MainAdmin } from "@1_pages/mainAdmin";
import { StaffList } from "@1_pages/staffList";
import { HtmlTemplates } from "@1_pages/htmlTemplates";
import { MedicalRecordList } from "@1_pages/medicalRecordList";
import { StaffAdd } from "@6_shared/Staff";
import { PatientList } from "@1_pages/patientList";
import { VisitHistory } from "@6_shared/VisitHistory";
import { PatientAdd } from "@6_shared/PatientAdd";
import { MedicalRecordAdd } from "@6_shared/MedicalRecordAdd";
import { CardTypes, Departments, Dictionaries, Filial, FilialDepartment, Positions, Specializations } from "@4_features/admin/dictionaries";
import { DoctorShift } from "@1_pages/doctorShift";
import { ShiftTransfer } from "@1_pages/shiftTransfer";
import { ShiftCreate } from "@1_pages/shiftCreate";
import { ShiftEdit } from "@1_pages/shiftEdit";
import { PatientCondition } from "@4_features/shift/PatientCondition";
import { PatchedHospitalStays } from "@4_features/shift/PatchedHospitalStays";
import { MainRegistry } from "@1_pages/mainRegistry";
import { MainHeadDoctor } from "@1_pages/mainHeadDoctor";
import { Recipes } from "@1_pages/recipes";
import { AddRecipeForm } from "@5_entities/recipe";
import { BookingAppointmentList } from "@4_features/record/RecordList/ui/BookingAppointmentList";

export const RouterComponent: FC = () => {
  const userLocal = JSON.parse(localStorage.getItem('user') || '{}');
  const position = userLocal.position || 'staff';
  const user = {
    role: 'Работник' // Администратор Работник Регистратура Заведующий
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Общий маршрут */}
        <Route path="/login" element={<Login />} />

        <Route
          path="*"
          element={
            <ProtectedRoute
              role={user.role}
              allowedRoles={["Администратор", "Работник", "Регистратура", "Заведующий"]}
            >
              {user.role === "Администратор" ? (

                <MainAdmin />
              ) : user.role === "Регистратура" ? (
                <MainRegistry />
              ) : user.role === "Заведующий" ? (
                <MainHeadDoctor />
              ) : (
                <Main />
              )}
            </ProtectedRoute>
          }
        >
          {/* Маршруты для админа */}
          {user.role === "Администратор" && (
            <>
              <Route path="staff" element={<StaffList />} />
              <Route path="staff/create" element={<StaffAdd />} />

              {/* <Route path="patients" element={<PatientList />} />
              <Route path="patients/create" element={<PatientAdd />}>
                <Route path="info" element={<PatientInfo />} />
                <Route path="passport" element={<PatientPassport />} />
                <Route path="medical-data" element={<MedicalData />} />
                <Route path="addresses" element={<PatientAddresses />} />
                <Route path="visit-history" element={<VisitHistory />} />
                <Route path="additional-info" element={<PatientAddForm />} />
              </Route> */}
              <Route path="registry" element={<Registry />} />
              <Route path="registry/patient" element={<Patient />}>
                <Route path="info" element={<PatientInfo />} />
                <Route path="passport" element={<PatientPassport />} />
                <Route path="medical-data" element={<MedicalData />} />
                <Route path="addresses" element={<PatientAddresses />} />
                <Route path="additional-info" element={<PatientAddForm />} />
              </Route>

              <Route path="medical-records" element={<MedicalRecordList />} />
              <Route path="medical-records/create" element={<MedicalRecordAdd />} />

              <Route path="html-templates" element={<HtmlTemplates />} />

              {/* Справочников */}
              <Route path="dictionaries" element={<Dictionaries />}>
                <Route index element={<Navigate to="specializations" replace />} />
                <Route path="specializations" element={<Specializations />} />
                <Route path="filial" element={<Filial />} />
                <Route path="filial-department" element={<FilialDepartment />} />
                <Route path="positions" element={<Positions />} />
                <Route path="departments" element={<Departments />} />
                <Route path="card-types" element={<CardTypes />} />
              </Route>

              <Route path="" element={<Navigate to="/staff" replace />} />
            </>
          )}

          {/* Маршруты для сотрудника */}
          {user.role === "Работник" && (
            <>
              <Route path="" element={<DashBoard />} />
              <Route path="chat">
                <Route index element={<Chat />} />
                <Route path=":id" element={<Chat />} />
              </Route>
              <Route path="registry" element={<Registry />} />
              
              <Route path="recipes" element={<Recipes />} />
              <Route path="recipes/create" element={<AddRecipeForm />} />

              <Route path="admission" element={<Admission />} >
                <Route path="diagnosis" element={<Diagnosis />} />
                <Route path="treatment-plan" element={<TreatmentPlan />} />
              </Route>
              {/*<Route path="record" element={<Record />} />*/}

              <Route path="booking-appointment" element={<BookingAppointmentList />}/>
              <Route path="booking-appointment/record" element={<Record/>}/>

              <Route path="registry/patient" element={<Patient />}>
                <Route path="info" element={<PatientInfo />} />
                <Route path="passport" element={<PatientPassport />} />
                <Route path="medical-data" element={<MedicalData />} />
                <Route path="addresses" element={<PatientAddresses />} />
                <Route path="additional-info" element={<PatientAddForm />} />
              </Route>
              <Route path="doctor-shift" element={<DoctorShift />} />
              <Route path="doctor-shift/transfer" element={<ShiftTransfer />} />
              <Route path="doctor-shift/create" element={<ShiftCreate />} />

              <Route path="doctor-shift/edit/:id" element={<ShiftEdit />}>
                <Route path="hospitalization" element={<PatchedHospitalStays />} />
                <Route path="conditions" element={<PatientCondition />} />
              </Route>
            </>
          )}

          {/* Маршруты для регистратуры */}
          {user.role === "Регистратура" && (
            <>
              <Route path="" element={<Navigate to="/medical-records" replace />} />

              <Route path="medical-records" element={<MedicalRecordList />} />
              <Route path="medical-records/create" element={<MedicalRecordAdd />} />
              <Route path="chat">
                <Route index element={<Chat />} />
                <Route path=":id" element={<Chat />} />
              </Route>
              <Route path="registry" element={<Registry />} />
              <Route path="registry/patient" element={<Patient />}>
                <Route path="info" element={<PatientInfo />} />
                <Route path="passport" element={<PatientPassport />} />
                <Route path="medical-data" element={<MedicalData />} />
                <Route path="addresses" element={<PatientAddresses />} />
                <Route path="additional-info" element={<PatientAddForm />} />
              </Route>
              <Route path="record" element={<Record />} />

            </>
          )}

          {/* Маршруты для заведующего отделением */}
          {user.role === "Заведующий" && (
            <>
              <Route path="" element={<Navigate to="/doctor-shift" replace />} />
              <Route path="staff" element={<StaffList />} />
              <Route path="staff/create" element={<StaffAdd />} />
              <Route path="chat">
                <Route index element={<Chat />} />
                <Route path=":id" element={<Chat />} />
              </Route>
              <Route path="doctor-shift" element={<DoctorShift userRole={user.role} />} />
              <Route path="doctor-shift/transfer" element={<ShiftTransfer />} />
              <Route path="doctor-shift/create" element={<ShiftCreate />} />
              <Route path="doctor-shift/edit/:id" element={<ShiftEdit />}>
                <Route path="hospitalization" element={<PatchedHospitalStays />} />
                <Route path="conditions" element={<PatientCondition />} />
              </Route>
              <Route path="patients" element={<PatientList />} />
              <Route path="patients/create" element={<PatientAdd />}>
                <Route path="info" element={<PatientInfo />} />
                <Route path="passport" element={<PatientPassport />} />
                <Route path="medical-data" element={<MedicalData />} />
                <Route path="addresses" element={<PatientAddresses />} />
                <Route path="visit-history" element={<VisitHistory />} />
                <Route path="additional-info" element={<PatientAddForm />} />
              </Route>
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}