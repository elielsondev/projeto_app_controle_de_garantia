import { useNavigate } from "react-router-dom";
import { type Nota } from "../data";

interface NoteItemProps {
  note: Nota;
}

const NoteItem = ({ note }: NoteItemProps) => {
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

  // Função para converter data DD/MM/YYYY para Date
  const parseDateToDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  // Função para converter Date para DD/MM/YYYY
  const formatDateToString = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Calcular a data de vencimento mais distante entre todas as garantias
  const getFurthestDueDate = (): string => {
    // Carregar datas adicionais de garantias
    const extendedWarrantyDates = JSON.parse(localStorage.getItem("extendedWarrantyDates") || "{}");
    const assistanceWarrantyDates = JSON.parse(localStorage.getItem("assistanceWarrantyDates") || "{}");

    const warrantyTypes = note.typeNote ? note.typeNote.split(",").map(t => t.trim()) : [];
    const extendedDate = extendedWarrantyDates[note.id];
    const assistanceDate = assistanceWarrantyDates[note.id];

    // Array para armazenar todas as datas de garantia
    const warrantyDates: Date[] = [];

    // Sempre adicionar a data principal (fim da garantia)
    warrantyDates.push(parseDateToDate(note.dueDate));

    // Se tiver Garantia Estendida e data preenchida, adicionar
    if (warrantyTypes.includes("Garantia Estendida") && extendedDate) {
      warrantyDates.push(parseDateToDate(extendedDate));
    }

    // Se tiver Garantia de Assistência e data preenchida, adicionar
    if (warrantyTypes.includes("Garantia de Assistência") && assistanceDate) {
      warrantyDates.push(parseDateToDate(assistanceDate));
    }

    // Encontrar a data mais distante no futuro (mais recente)
    const furthestDate = warrantyDates.reduce((latest, current) => {
      return current > latest ? current : latest;
    });

    return formatDateToString(furthestDate);
  };

  const furthestDueDate = getFurthestDueDate();

  const handleClick = () => {
    navigate("/note", { state: { note } });
  }

  return (
    <div onClick={handleClick} className="bg-[#724EBF]/30 rounded-xl p-4 shadow text-left transition-transform duration-150 hover:scale-105 md:hover:scale-105">
      <div className="pb-2 mb-2">
        <h3 className="font-bold">{note.title}</h3>
        <div className="flex justify-between items-center text-sm indent-2">
          <p>{note.store}</p>
          <p className="font-semibold text-gray-600">N° da nota: {note.numeroNota}</p>
        </div>
      </div>

      <p className="indent-0.5 text-sm"><span className="font-semibold">Compra:</span> {note.purchaseDate}</p>
      <p className="indent-0.5 text-sm"><span className="font-semibold">Data de Vencimento:</span> {furthestDueDate}</p>
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

export default NoteItem;