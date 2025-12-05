import React from "react";
import "../style/Login.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
// Componente de registro de usuário / cadastro
function Register() {
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
          id="nome-register"
          placeholder="Nome"
          className="inputs"
        />

        <input
          type="email"
          name="email"
          id="email-register"
          placeholder="Email"
          className="inputs"
        />

        <input
          type="password"
          name="password"
          id="password-register"
          placeholder="Criar senha"
          className="inputs"
        />

        <input
          type="password"
          name="password"
          id="password-register"
          placeholder="Confirmar senha"
          className="inputs"
        />

        <Link to="/">
          <span className="be-vietnam-pro-bold text-white">Registrar</span>
        </Link>

        <hr />

        <div>
          <a href="#" className="be-vietnam-pro-regular ">
            Esqueceu a senha?
          </a>
        </div>
      </form>
    </div>
  );
}

export default Register;
