import React from "react";
import "../style/Login.css";
import logo from "../assets/logo.png";

// Componente de login de usuário
function Login() {
  return (
    <div className="login-container">
      <form className="login-form">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <img src={logo} alt="" width={50} />
          <h2 className="be-vietnam-pro-black text-2xl mb-4">apontiNote</h2>
        </div>

        <input
          type="email"
          name="email"
          id="email-login"
          placeholder="Email"
          className=""
        />

        <input
          type="password"
          name="password"
          id="password-login"
          placeholder="Senha"
          className=""
        />

        <button className="be-vietnam-pro-bold">Entrar</button>

        <label htmlFor="conectado" className="be-vietnam-pro-regular">
          <input type="radio" name="conectado" id="conectado" />
          Manter-me conectado
        </label>

        <div>
          <a href="#" className="be-vietnam-pro-regular ">
            Esqueceu a senha?
          </a>
        </div>
        <hr />
        <div>
          <a href="#" className="be-vietnam-pro-regular">
            Não tem uma conta? Cadastre-se
          </a>
        </div>
      </form>
    </div>
  );
}

export default Login;
