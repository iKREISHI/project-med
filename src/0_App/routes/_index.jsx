import {MainPage} from "../../1_Pages/mainPage";
import {RegisterForm} from "../../1_Pages/registrForm";


import {BrowserRouter, Routes, Route} from "react-router-dom";

export function MainRouter(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<MainPage/>}/>
        <Route path="/registration" element={<RegisterForm/>}/>
      </Routes>
    </BrowserRouter>
    )
}