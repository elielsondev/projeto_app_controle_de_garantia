// import React from "react";
import { useNavigate} from "react-router-dom";
import logo from "../assets/logo.png";
import { useState } from 'react';

// Componente de login de usuário
function AuthAdmin() {
  const navigate = useNavigate();
  const [email, setEmail ] = useState("");
  const [password, setPassword ] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // Lógica de autenticação do administrador pode ser adicionada aqui
    if (email === "admin" && password === "admin") {
      navigate("/register");
      sessionStorage.setItem("loginAdmin", "true");
    }

  }

  return (
    <div className="be-vietnam-pro-black flex flex-col items-center justify-center gap-8 min-h-screen bg-violet-700">
      <form className="flex flex-col gap-2 bg-white p-4 rounded-2xl shadow-lg w-88">
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
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email-login"
          placeholder="admin"
          className="px-5 py-2 mx-4 mb-1 bg-[#bfbfbf] text-black rounded-xl border-none outline-none cursor-pointer"
        />

        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password-login"
          placeholder="senha"
          className="px-5 py-2 mx-4 bg-[#bfbfbf] text-black rounded-xl border-none outline-none cursor-pointer"
        />

        <button
          onClick={handleLogin}
          className="m-3 font-bold text-white py-2 rounded-xl bg-[#5f1bf2] hover:bg-[#724ebf] transition-colors"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

export default AuthAdmin;
