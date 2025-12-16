// import React from "react";
import "../style/Login.css";
import logo from "../assets/logo.png";
import { Link} from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

// Componente de login de usuário
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e : React.FormEvent) => {
    e.preventDefault();
    
    const users = JSON.parse(localStorage.getItem("users") || "[]");
  
    const user = users.find(
      (user: { email: string; password: string }) =>
        user.email === email && user.password === password
    );

    if (user) {
      // Redirecionar com react router dom para página /home após login bem-sucedido
      // SweetAlert2 para mostrar mensagem de sucesso
      Swal.fire({
        title: 'Login bem-sucedido!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        window.location.href = "/home";
      });
      return 
    } else {
      // SweetAlert2 para mostrar mensagem de erro
      Swal.fire({
        title: 'Login falhou!',
        text: 'Email ou senha incorretos',
        icon: 'error',
        confirmButtonText: 'OK'
      }).then(() => {
        setEmail("");
        setPassword("");
      });
    }
  };

  // Verificar se o usuário já está logado ao carregar o componente 
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn) {
      // Redirecionar para a página /home se o usuário estiver logado
      window.location.href = "/home";
    }
  }, []);

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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email-login"
          placeholder="Email"
          className="inputs"
        />

        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password-login"
          placeholder="Senha"
          className="inputs"
        />

        <button
          onClick={handleLogin}
          className="be-vietnam-pro-bold text-white"
        >
          Entrar
        </button>

        <label htmlFor="conectado" className="be-vietnam-pro-regular">
          <input
            type="radio"
            name="conectado"
            value="conectado"
            className="inputs"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            id="conectado"
          />
          Manter-me conectado
        </label>

        <div>
          <a href="#" className="be-vietnam-pro-regular ">
            Esqueceu a senha?
          </a>
        </div>
        <hr />
        <div>
          <Link to="/register" className="be-vietnam-pro-regular">
            Não tem uma conta? Cadastre-se
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
