// import React from "react";
import "../style/Login.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { useState } from "react";
// Componente de registro de usuário / cadastro
function Register() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Registrar cadastro no array de usuários no localStorage
  const handleRegister = () => {
    // Verificar se as senhas coincidem
    if (password !== confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }
    
    // Verificar se o usuário já existe no localStorage
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const userExists = existingUsers.some((user: { email: string }) => user.email === email);
    if (userExists) {
      alert("Usuário já cadastrado com este email");
      return;
    }



    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = {
      userName,
      email,
      password,
    };
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  };

  return (
    <div className="login-container">
      <form className="login-form">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <img src={logo} alt="" width={50} />
          <h2 className="be-vietnam-pro-black text-2xl mb-4">apontiNote</h2>
        </div>

        <input
          type="text"
          name="name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          id="nome-register"
          placeholder="Nome"
          className="inputs"
          required
        />

        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email-register"
          placeholder="Email"
          className="inputs"
          required
        />

        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password-register"
          placeholder="Criar senha"
          className="inputs"
          required
        />

        <input
          type="password"
          name="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          id="password-register"
          placeholder="Confirmar senha"
          className="inputs"
          required
        />

        <Link to="/">
          <span 
            onClick={handleRegister}
            className="be-vietnam-pro-bold text-white"
          >
            Registrar
          </span>
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
