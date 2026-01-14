import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { ArrowLeft, Mail } from "lucide-react";
import { useToast } from "../contexts/ToastContext";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userPassword, setUserPassword] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast("Por favor, insira seu email", "warning");
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Por favor, insira um email válido", "error");
      return;
    }

    // Buscar usuário no localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: { email: string; password: string }) => u.email === email);

    if (user) {
      setUserPassword(user.password);
      setShowPassword(true);
      showToast("Email encontrado! Sua senha está abaixo.", "success");
    } else {
      showToast("Email não encontrado no sistema", "error");
      setEmail("");
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="be-vietnam-pro-black flex flex-col items-center justify-center gap-8 min-h-screen bg-violet-700">
      <form className="flex flex-col gap-2 bg-white p-4 rounded-2xl shadow-lg w-88">
        <div className="flex items-center justify-center gap-2 mb-6 mt-3">
          <img src={logo} alt="Logo Aponti" width={50} />
          <h2 className="text-2xl font-bold text-[#5f1bf2] leading-none"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.25)" }}>
            apontiNote</h2>
        </div>

        {!showPassword ? (
          <>
            <div className="flex items-center justify-center mb-2">
              <Mail className="w-8 h-8 text-[#5f1bf2]" />
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">
              Recuperar Senha
            </h3>
            <p className="text-sm text-gray-600 text-center mb-4 px-2">
              Digite seu email cadastrado para recuperar sua senha
            </p>

            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email cadastrado"
              className="px-5 py-2 mx-4 mb-1 bg-[#bfbfbf] text-black rounded-xl border-none outline-none cursor-pointer"
              required
            />

            <button
              onClick={handleSubmit}
              className="m-3 font-bold text-white py-2 rounded-xl bg-[#5f1bf2] hover:bg-[#724ebf] transition-colors"
            >
              Recuperar Senha
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center mb-2">
              <Mail className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">
              Senha Recuperada
            </h3>
            <p className="text-sm text-gray-600 text-center mb-4 px-2">
              Sua senha é:
            </p>

            <div className="mx-4 mb-4 p-4 bg-gray-100 rounded-xl border-2 border-[#5f1bf2]">
              <p className="text-center font-mono text-lg font-bold text-[#5f1bf2]">
                {userPassword}
              </p>
            </div>

            <p className="text-xs text-gray-500 text-center mb-4 px-2">
              Anote sua senha em um local seguro. Você pode alterá-la nas configurações após fazer login.
            </p>

            <button
              onClick={handleBackToLogin}
              className="m-3 font-bold text-white py-2 rounded-xl bg-[#5f1bf2] hover:bg-[#724ebf] transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para Login
            </button>
          </>
        )}

        <hr className="border-t border-[#724EBF] mb-2" />
        <div className="text-center">
          <Link to="/login" className="text-black hover:underline text-sm">
            Lembrou sua senha? Fazer login
          </Link>
        </div>
        <div className="text-center">
          <Link to="/register" className="text-black hover:underline text-sm">
            Não tem uma conta? Cadastre-se
          </Link>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
