// import React from "react";
import "../style/Login.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { useState } from "react";

// Componente de login de usuário
function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  // Função para lidar com o envio do formulário de login
  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Lógica para lidar com o envio do formulário de login
    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;
    console.log("Email:", email);
    console.log("Password:", password);
  };

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
          className="inputs"

        />

        <input
          type="password"
          name="password"
          id="password-login"
          placeholder="Senha"
          className="inputs"
        />

        <Link to="/">
          <span 
            onClick={handleLogin}
            className="be-vietnam-pro-bold text-white"
          >
            Entrar
          </span>
        </Link>

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
          <a href="/register" className="be-vietnam-pro-regular">
            Não tem uma conta? Cadastre-se
          </a>
        </div>
      </form>
    </div>
  );
}

export default Login;
