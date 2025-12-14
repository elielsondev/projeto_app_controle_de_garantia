import {
  X,
  FileText,
  Trash2,
  Settings,
  ChevronDown
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
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
        <nav className="px-4 space-y-4">
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
      </aside>
    </>
  );
};

export default Sidebar;