import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Chat } from "../../1_pages/chat";
import { DashBoard } from "../../1_pages/dashboard";
import { Registry } from "../../1_pages/registry";
import { Main } from "../../1_pages/main";
import { Login } from "../../1_pages/login"

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
          <Route path="registry/new-patient" element={<h1>Новый пациент</h1>} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>

  )
}