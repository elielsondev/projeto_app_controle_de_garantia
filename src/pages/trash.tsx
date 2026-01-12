import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.tsx";
import { Trash2 } from "lucide-react"; // Usando a biblioteca que já existe no seu Sidebar
import { type Nota } from "../data";

const Trash = () => {
  const [deletedNotes, setDeletedNotes] = useState<Nota[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedDeletedNotes = JSON.parse(localStorage.getItem("trashNotes") || "[]");
    setDeletedNotes(savedDeletedNotes);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      {/* Título da Página - Ajustado para remover o texto "delete" */}
      <div className="w-full px-5 sm:px-15 mt-5 mb-5 text-left">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
           <Trash2 size={24} /> Lixeira
        </h1>
      </div>

      {deletedNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 px-4">
          {/* Ícone centralizado sem o texto "delete_outline" */}
          <div className="bg-gray-200 p-8 rounded-full mb-4 text-gray-400">
            <Trash2 size={60} />
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Sua lixeira está vazia
          </h2>
          <p className="text-gray-500 text-center max-w-md">
            Notas excluídas aparecerão aqui e poderão ser restauradas ou excluídas permanentemente.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 px-9">
          {/* Aqui entrariam os itens se a lixeira não estivesse vazia */}
        </div>
      )}
    </div>
  );
};

export default Trash;