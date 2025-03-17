import { LoginModel } from "../../../5_entities/user/model/model.ts";
import {FC, useState} from "react";
import {login} from "../api/login.ts";

export const LoginForm = () => {

  //Состояние реквизитов для входа
  const [credentials, setCredentials] = useState<LoginModel>({
    username:"",
    password:""
  })

  //Отправка данных на сервер
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(credentials)
  }

  return(
    <form onSubmit={handleSubmit}>
      <input
        type={'text'}
        value={credentials.username}
        onChange={(e) => setCredentials({...credentials, username: e.target.value})}
      />
      <input
        type={'password'}
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
      />
      <button type={'submit'}>Войти</button>
    </form>
  )
}
