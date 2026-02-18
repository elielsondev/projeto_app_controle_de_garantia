import { useNavigate } from "react-router-dom";
import { type Nota } from "../data";

interface TrashNoteItemProps {
     note: Nota;
     isSelected: boolean;
     onSelect: (noteId: number, selected: boolean) => void;
}

const TrashNoteItem = ({ note, isSelected, onSelect }: TrashNoteItemProps) => {
     const navigate = useNavigate();
     const statusColor =
          note.status === "Em Garantia"
               ? "text-[#478E2C]"
               : note.status === "Vencendo"
                    ? "text-[#CA8A04]"
                    : "text-[#D41414]";

     // Função para formatar valor monetário brasileiro
     const formatCurrency = (value: number): string => {
          return new Intl.NumberFormat("pt-BR", {
               style: "currency",
               currency: "BRL",
          }).format(value);
     };

     const handleClick = () => {
          // Alternar seleção ao clicar na nota
          onSelect(note.id, !isSelected);
     };

     const handleDoubleClick = () => {
          // Navegar para a nota ao dar duplo clique
          navigate("/note", { state: { note } });
     };

     return (
          <div
               onClick={handleClick}
               onDoubleClick={handleDoubleClick}
               className={`bg-[#724EBF]/30 rounded-xl p-4 shadow text-left transition-transform duration-150 hover:scale-105 md:hover:scale-105 cursor-pointer ${isSelected ? "ring-2 ring-[#724EBF] ring-offset-2" : ""
                    }`}
          >
               <div className="pb-2">
                    <h3 className="font-bold">{note.title}</h3>
                    <div className="flex justify-between items-center text-sm indent-2">
                         <p>{note.store}</p>
                         <p className="font-semibold text-gray-600">N° da nota: {note.numeroNota}</p>
                    </div>
               </div>

               <p className="indent-0.5 text-sm"><span className="font-semibold">Compra:</span> {note.purchaseDate}</p>
               <p className="indent-0.5 text-sm"><span className="font-semibold">Data de Vencimento:</span>{note.dueDate}</p>
               <p className="indent-0.5 text-sm mt-0.5"><span className="font-semibold">Tipo:</span> {note.typeNote}</p>
               <p className="indent-0.5 text-sm mt-0.5"><span className="font-semibold">Criado por:</span> {note.createdBy}</p>

               <div className="border-t flex justify-between items-center mt-4 pt-1.5">
                    <span className="font-bold text-lg">
                         {formatCurrency(note.value)}
                    </span>
                    <span
                         className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}
                    >
                         {note.status}
                    </span>
               </div>
          </div>
     );
};

export default TrashNoteItem;

