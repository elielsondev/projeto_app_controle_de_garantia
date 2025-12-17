import {
  X,
  FileText,
  Trash2,
  Settings,
  ChevronDown,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpar dados de autenticação do localStorage e sessionStorage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedUserEmail");
    localStorage.removeItem("rememberedEmail");
    sessionStorage.removeItem("isLoggedIn");
    
    // Fechar o sidebar
    onClose();
    
    // Redirecionar para a tela de login
    navigate("/login");
  };

  return (
    <>
      {/* Overlay escuro */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* Menu lateral */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64
          bg-linear-to-b from-purple-700 to-purple-900
          text-white
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header do menu */}
        <div className="flex items-center justify-between p-4">
          <span className="text-lg font-semibold">Menu</span>
          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col h-[calc(100%-4rem)]">
          <nav className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
            {/* Minhas Notas */}
            <div>
              <button className="flex items-center gap-2 font-medium">
                <FileText size={18} />
                Minhas Notas
                <ChevronDown size={16} />
              </button>

              <div className="mt-2 ml-6 space-y-2 text-sm">
                <button className="px-3 py-1 rounded-full bg-white/20">
                  Todas as Notas
                </button>
                <p className="opacity-80">Garantia Estendida</p>
                <p className="opacity-80">Garantia de Fabrica</p>
              </div>
            </div>

            {/* Lixeira */}
            <button className="flex items-center gap-2">
              <Trash2 size={18} />
              Lixeira
            </button>

            {/* Configurações */}
            <button className="flex items-center gap-2">
              <Settings size={18} />
              Configurações
            </button>
          </nav>

          {/* Botão Sair - no final do sidebar */}
          <div className="px-4 pb-4 border-t border-white/20 pt-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full text-red-300 hover:text-red-200 transition-colors"
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;