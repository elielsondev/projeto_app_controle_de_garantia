// import React from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";

// Componente de registro de usuário / cadastro
function Register() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // Registrar cadastro no array de usuários no localStorage
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Verificar se as senhas coincidem
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "As senhas não coincidem",
      });
      return;
    }

    // Verificar se o usuário já existe no localStorage
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const userExists = existingUsers.some(
      (user: { email: string }) => user.email === email
    );
    if (userExists) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Usuário já cadastrado com este email",
      }).then(() => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      });
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

    // Opcional: limpar campos
    setUserName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    // SweetAlert2 para mostrar mensagem de sucesso
    Swal.fire({
      title: "Cadastro realizado com sucesso! Faça login para continuar.",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      navigate("/login");
    });
  };

  return (
    <div className="be-vietnam-pro-black flex flex-col items-center justify-center gap-8 min-h-screen bg-violet-700">
      <form
        className="flex flex-col gap-2 bg-white p-4 rounded-2xl shadow-lg w-88"
        onSubmit={handleRegister}
      >
        <div className="flex items-center justify-center gap-2 mb-6 mt-3">
          <img src={logo} alt="Logo Aponti" width={50} />
          <h2
            className="text-2xl font-bold text-[#5f1bf2] leading-none"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.25)" }}
          >
            apontiNote
          </h2>
        </div>

        <input
          type="text"
          name="name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          id="nome-register"
          placeholder="Nome"
          className="px-5 py-2 mx-5 mb-1 bg-[#bfbfbf] text-black rounded-xl border-none outline-none cursor-pointer"
          required
        />

        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email-register"
          placeholder="Email"
          className="px-5 py-2 mx-5 mb-1 bg-[#bfbfbf] text-black rounded-xl border-none outline-none cursor-pointer"
          required
        />

        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password-register"
          placeholder="Criar senha"
          className="px-5 py-2 mx-5 mb-1 bg-[#bfbfbf] text-black rounded-xl border-none outline-none cursor-pointer"
          required
        />

        <input
          type="password"
          name="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          id="password-register-confirm"
          placeholder="Confirmar senha"
          className="px-5 py-2 mx-5 mb-1 bg-[#bfbfbf] text-black rounded-xl border-none outline-none cursor-pointer"
          required
        />

        <button
          type="submit"
          className="mt-4 mb-3 w-full font-bold text-white py-2 rounded-xl bg-[#5f1bf2] hover:bg-[#724ebf] transition-colors"
        >
          Registrar
        </button>
      </form>
    </div>
  );
}

export default Register;
