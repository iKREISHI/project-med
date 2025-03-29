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
import { CardTypes, Departments, Dictionaries, Filial, Positions, Specializations } from "@4_features/admin/dictionaries";


export const RouterComponent: FC = () => {
  const userLocal = JSON.parse(localStorage.getItem('user') || '{}');
  const position = userLocal.position || 'staff';
  const user = {
    role: 'Администратор' // admin staff
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Общий маршрут */}
        <Route path="/login" element={<Login />} />

        <Route
          path="*"
          element={
            <ProtectedRoute role={user.role} allowedRoles={["Администратор", "Работник"]}>
              {user.role === "Администратор" ? (
                <MainAdmin />
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
            
              <Route path="patients" element={<PatientList />} />
              <Route path="patients/create" element={<PatientAdd />}>
                <Route path="info" element={<PatientInfo />} />
                <Route path="passport" element={<PatientPassport />} />
                <Route path="medical-data" element={<MedicalData />} />
                <Route path="addresses" element={<PatientAddresses />} />
                <Route path="visit-history" element={<VisitHistory />} />
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
              <Route path="document" element={<div>document</div>} />
              <Route path="registry" element={<Registry />} />
              <Route path="admission" element={<Admission />} >
                <Route path="diagnosis" element={<Diagnosis />} />
                <Route path="treatment-plan" element={<TreatmentPlan />} />
              </Route>
              <Route path="record" element={<Record />} />
              <Route path="registry/patient" element={<Patient />}>
                <Route path="info" element={<PatientInfo />} />
                <Route path="passport" element={<PatientPassport />} />
                <Route path="medical-data" element={<MedicalData />} />
                <Route path="addresses" element={<PatientAddresses />} />
                <Route path="additional-info" element={<PatientAddForm />} />
              </Route>
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}