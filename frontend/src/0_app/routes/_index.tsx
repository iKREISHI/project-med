import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Chat } from "@1_pages/chat";
import { DashBoard } from "@1_pages/dashboard";
import { Registry } from "@1_pages/registry";
import { Main } from "@1_pages/main";
import { Login } from "@1_pages/login"
import { Patient } from "@6_shared/Patient";
import { PatientInfo } from "@6_shared/PatientInfo";
import { PatientAddresses } from "@6_shared/Addresses";
import { PatientPassport } from "@6_shared/Passport";
import { VisitHistory } from "@6_shared/VisitHistory";
import { MedicalData } from "@6_shared/MedicalData";
import { Admission } from "@1_pages/admission";
import { Record } from "@1_pages/record";
import { TreatmentPlan } from "@6_shared/TreatmentPlan";
import { Diagnosis } from "@6_shared/Diagnosis";
import {PatientAddForm} from "@4_features/patient/RegisterAddForm";

export const RouterComponent: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Main />}>
          <Route path="" element={<DashBoard />} />
          {/* <Route path="chat" element={<Chat />} /> */}
          <Route path="chat">
            <Route index element={<Chat />} />
            <Route path=":id" element={<Chat />} />
          </Route>
          <Route path="document" element={<div>document</div>} />
          {/* <Route path="schedule" element={<div>schedule</div>} /> */}
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
            <Route path="visit-history" element={<VisitHistory />} />
            <Route path="additional-info" element={<PatientAddForm/>} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>

  )
}
