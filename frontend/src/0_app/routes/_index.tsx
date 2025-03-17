import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Chat } from "../../1_pages/chat";
import { DashBoard } from "../../1_pages/dashboard";
import { Registry } from "../../1_pages/registry/Registry";
import { Main } from "../../1_pages/main";
import { Login } from "../../1_pages/login"
import { Patient } from "../../1_pages/registry/Patient";
import { PatientInfo } from "../../1_pages/registry/PatientInfo";
import { PatientAddresses } from "../../1_pages/registry/Addresses";
import { PatientPassport } from "../../1_pages/registry/Passport";
import { VisitHistory } from "../../1_pages/registry/VisitHistory";
import { MedicalData } from "../../1_pages/registry/MedicalData";
import { AdditionalInfo } from "../../1_pages/registry/AdditionalInfo";

export const RouterComponent: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Main />}>
          <Route path="" element={<DashBoard />} />
          <Route path="chat" element={<Chat />} />
          <Route path="document" element={<div>document</div>} />
          <Route path="schedule" element={<div>schedule</div>} />
          <Route path="registry" element={<Registry />} />
          <Route path="registry/patient" element={<Patient />}>
            <Route path="info" element={<PatientInfo />} />
            <Route path="passport" element={<PatientPassport />} /> 
            <Route path="medical-data" element={<MedicalData />} /> 
            <Route path="addresses" element={<PatientAddresses />} /> 
            <Route path="visit-history" element={<VisitHistory />} /> 
            <Route path="additional-info" element={<AdditionalInfo />} /> 
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>

  )
}
