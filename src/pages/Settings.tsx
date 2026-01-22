import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, X, Check } from "lucide-react";
import Swal from "sweetalert2";
import Header from "../components/Header.tsx";
import ProfilePhoto from "../components/ProfilePhoto";
import { useToast } from "../contexts/ToastContext";

export default function SettingsPage() {
     const navigate = useNavigate();
     const { showToast } = useToast();
     const [isEditing, setIsEditing] = useState(false);
     const [userName, setUserName] = useState("");
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [cargo, setCargo] = useState("");
     const [originalEmail, setOriginalEmail] = useState("");
     
     // Valores originais para restaurar ao cancelar
     const [originalValues, setOriginalValues] = useState({
          userName: "",
          email: "",
          password: "",
          cargo: ""
     });

     // Carregar dados do usuário logado
     useEffect(() => {
          const loggedUserEmail = localStorage.getItem("loggedUserEmail") || sessionStorage.getItem("loggedUserEmail");
          
          if (!loggedUserEmail) {
               // Se não estiver logado, redirecionar para login
               navigate("/login");
               return;
          }

          const users = JSON.parse(localStorage.getItem("users") || "[]");
          const user = users.find((u: { email: string; userName: string; cargo?: string }) => u.email === loggedUserEmail);

          if (user) {
               const initialUserName = user.userName || "";
               const initialEmail = user.email || "";
               const initialPassword = user.password || "";
               const initialCargo = user.cargo || "";
               
               setUserName(initialUserName);
               setEmail(initialEmail);
               setPassword(initialPassword);
               setCargo(initialCargo);
               setOriginalEmail(initialEmail);
               
               // Salvar valores originais
               setOriginalValues({
                    userName: initialUserName,
                    email: initialEmail,
                    password: initialPassword,
                    cargo: initialCargo
               });
          }
     }, [navigate]);

     // Função para entrar em modo de edição
     const handleEdit = () => {
          // Salvar valores atuais como originais antes de editar
          setOriginalValues({
               userName,
               email,
               password,
               cargo
          });
          setIsEditing(true);
     };

     // Função para cancelar edição
     const handleCancel = () => {
          // Restaurar valores originais
          setUserName(originalValues.userName);
          setEmail(originalValues.email);
          setPassword(originalValues.password);
          setCargo(originalValues.cargo);
          setIsEditing(false);
     };

     // Função para salvar alterações
     const handleSave = () => {
          if (!userName.trim() || !email.trim()) {
               showToast("Nome e Email são obrigatórios", "warning");
               return;
          }

          // Validar formato de email
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
               showToast("Por favor, insira um email válido", "error");
               return;
          }

          const users = JSON.parse(localStorage.getItem("users") || "[]");
          
          // Verificar se o email foi alterado e se já existe outro usuário com esse email
          if (email !== originalEmail) {
               const emailExists = users.some((u: { email: string }) => u.email === email && u.email !== originalEmail);
               if (emailExists) {
                    showToast("Este email já está sendo usado por outro usuário", "error");
                    return;
               }
          }

          // Atualizar dados do usuário
          const updatedUsers = users.map((u: { email: string; userName: string; password: string; cargo?: string }) => {
               if (u.email === originalEmail) {
                    return {
                         ...u,
                         userName,
                         email,
                         password: password || u.password, // Se não preencher senha, mantém a anterior
                         cargo: cargo || ""
                    };
               }
               return u;
          });

          localStorage.setItem("users", JSON.stringify(updatedUsers));

          // Se o email foi alterado, atualizar o loggedUserEmail
          if (email !== originalEmail) {
               if (localStorage.getItem("loggedUserEmail")) {
                    localStorage.setItem("loggedUserEmail", email);
               }
               if (sessionStorage.getItem("loggedUserEmail")) {
                    sessionStorage.setItem("loggedUserEmail", email);
               }
               setOriginalEmail(email);
          }

          showToast("Alterações salvas com sucesso!", "success");
          setIsEditing(false);
          // Atualizar valores originais após salvar
          setOriginalValues({
               userName,
               email,
               password,
               cargo
          });
     };

     // Função para fazer logout
     const handleLogout = () => {
          Swal.fire({
               title: 'Tem certeza?',
               text: 'Deseja realmente sair da sua conta?',
               icon: 'question',
               showCancelButton: true,
               confirmButtonColor: '#724EBF',
               cancelButtonColor: '#d33',
               confirmButtonText: 'Sim, sair',
               cancelButtonText: 'Cancelar'
          }).then((result) => {
               if (result.isConfirmed) {
                    // Limpar dados de autenticação
                    localStorage.removeItem("isLoggedIn");
                    localStorage.removeItem("loggedUserEmail");
                    localStorage.removeItem("rememberedEmail");
                    sessionStorage.removeItem("isLoggedIn");
                    sessionStorage.removeItem("loggedUserEmail");

                    showToast("Logout realizado com sucesso!", "success");
                    setTimeout(() => {
                         navigate("/login");
                    }, 500);
               }
          });
     };

     return (
          <>
               <Header />
               <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-8">
                    <div className="w-full max-w-3xl">
                         {/* Header */}
                         <header className="mb-8">
                              <h1 className="text-2xl font-bold text-[#724EBF]">Configurações</h1>
                              <p className="text-sm text-gray-500">Gerencie as informações da sua conta</p>
                         </header>

                         {/* Card principal */}
                         <div className="bg-white rounded-xl shadow p-6">
                              {/* Perfil */}
                              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                                   <ProfilePhoto />
                                   <div className="text-center sm:text-left">
                                        <h1 className="text-lg font-semibold">{userName || "Usuário"}</h1>
                                   </div>
                              </div>

                              {/* Formulário */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                        <input
                                             type="text"
                                             value={userName}
                                             onChange={(e) => setUserName(e.target.value)}
                                             placeholder="Nome do Usuário"
                                             disabled={!isEditing}
                                             className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#724EBF] outline-none ${
                                                  !isEditing ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "bg-white"
                                             }`}
                                        />
                                   </div>

                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                             type="email"
                                             value={email}
                                             onChange={(e) => setEmail(e.target.value)}
                                             placeholder="email@exemplo.com"
                                             disabled={!isEditing}
                                             className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#724EBF] outline-none ${
                                                  !isEditing ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "bg-white"
                                             }`}
                                        />
                                   </div>

                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                                        <input
                                             type="password"
                                             value={password}
                                             onChange={(e) => setPassword(e.target.value)}
                                             placeholder="Deixe em branco para manter a senha atual"
                                             disabled={!isEditing}
                                             className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#724EBF] outline-none ${
                                                  !isEditing ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "bg-white"
                                             }`}
                                        />
                                   </div>

                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                                        <input
                                             type="text"
                                             value={cargo}
                                             onChange={(e) => setCargo(e.target.value)}
                                             placeholder="Gerente / Usuário"
                                             disabled={!isEditing}
                                             className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#724EBF] outline-none ${
                                                  !isEditing ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "bg-white"
                                             }`}
                                        />
                                   </div>
                              </div>

                              {/* Ações */}
                              <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
                                   <button 
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 text-red-600 hover:underline"
                                   >
                                        <LogOut className="w-4 h-4" />
                                        Sair da conta
                                   </button>

                                   {!isEditing ? (
                                        <button 
                                             onClick={handleEdit}
                                             className="px-8 py-3 rounded-lg bg-[#724EBF] text-white font-semibold hover:bg-[#5a3a9f] transition"
                                        >
                                             Editar
                                        </button>
                                   ) : (
                                        <div className="flex gap-3">
                                             <button 
                                                  onClick={handleCancel}
                                                  className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition flex items-center gap-2"
                                             >
                                                  <X className="w-4 h-4" />
                                                  Cancelar
                                             </button>
                                             <button 
                                                  onClick={handleSave}
                                                  className="px-8 py-3 rounded-lg bg-[#724EBF] text-white font-semibold hover:bg-[#5a3a9f] transition flex items-center gap-2"
                                             >
                                                  <Check className="w-4 h-4" />
                                                  Salvar
                                             </button>
                                        </div>
                                   )}
                              </div>
                         </div>
                    </div>
               </div>
          </>
     );
}