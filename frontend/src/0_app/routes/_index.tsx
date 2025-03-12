import {FC} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Chat} from "../../1_pages/chat";
import {DashBoard} from "../../1_pages/dashboard";
import {Registry} from "../../1_pages/registry";


export const RouterComponent: FC = () =>{
  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<DashBoard/>}/>
        <Route path={'/chat'} element={<Chat/>}/>
        <Route path={'/registry'} element={<Registry/>}/>
      </Routes>
    </BrowserRouter>

  )
}