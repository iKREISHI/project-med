import {FC} from "react";
import {LoginForm} from "../../../3_features/auth/ui/LoginForm.tsx";

export const LoginPage: FC = () => {
  return(
    <>
      <h1>Страница входа</h1>
      <LoginForm/>
    </>
  )
}