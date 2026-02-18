// import React from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "../contexts/ToastContext";

// Componente de login de usuário
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const user = users.find(
      (user: { email: string; password: string }) =>
        user.email === email && user.password === password
    );

    if (user) {
      // Guardar estado de login no localStorage apenas se "Manter-me conectado" estiver marcado
      if (rememberMe) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("loggedUserEmail", user.email);
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("loggedUserEmail");
      } else {
        // Se não marcou "Manter-me conectado", usa sessionStorage (não persiste ao recarregar)
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("loggedUserEmail", user.email);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("loggedUserEmail");
      }

      showToast("Login realizado com sucesso!", "success");
      setTimeout(() => {
        navigate("/home");
      }, 500);
      return;
    } else {
      showToast("Email ou senha incorretos", "error");
      setEmail("");
      setPassword("");
    }
  };

  // Verificar se o usuário já está logado ao carregar o componente 
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const rememberedEmail = localStorage.getItem("rememberedEmail");

    // Só redireciona para /home se tiver "Manter-me conectado" ativo
    if (isLoggedIn === "true") {
      navigate("/home");
    }

    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, [navigate]);

  return (
    <div className="be-vietnam-pro-black flex flex-col items-center justify-center gap-8 min-h-screen bg-violet-700">
      <form className="flex flex-col gap-2 bg-white p-4 rounded-2xl shadow-lg w-88">
        <div className="flex items-center justify-center gap-2 mb-6 mt-3">
          <img src={logo} alt="Logo Aponti" width={50} />
          <h2 className="text-2xl font-bold text-[#5f1bf2] leading-none"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.25)" }}>
            apontiNote</h2>
        </div>

        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email-login"
          placeholder="Email"
          className="px-5 py-2 mx-4 mb-1 bg-[#bfbfbf] text-black rounded-xl border-none outline-none cursor-pointer"
        />

        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password-login"
          placeholder="Senha"
          className="px-5 py-2 mx-4 bg-[#bfbfbf] text-black rounded-xl border-none outline-none cursor-pointer"
        />

        <button
          onClick={handleLogin}
          className="m-3 font-bold text-white py-2 rounded-xl bg-[#5f1bf2] hover:bg-[#724ebf] transition-colors"
        >
          Entrar
        </button>

        <label className="cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="
      appearance-none
      w-3.5 h-3.5 mr-2
      rounded-full
      border-2 border-[#5f1bf2]
      cursor-pointer
      transition-all
      checked:bg-[#5f1bf2]
      checked:border-[#5f1bf2]
    "
          />
          <span className="text-black">Manter-me conectado</span>
        </label>

        <div>
          <Link to="/forgot-password" className="text-black hover:underline">
            Esqueceu a senha?
          </Link>
        </div>
        <hr className="border-t border-[#724EBF] mb-2" />
        <div>
          <Link to="/auth-admin" className=" text-black hover:underline">
            Não tem uma conta? Cadastre-se
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
