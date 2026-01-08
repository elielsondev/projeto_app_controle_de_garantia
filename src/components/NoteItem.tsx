import { useNavigate } from "react-router-dom";
import { type Nota } from "../data";

interface NoteItemProps {
  note: Nota;
}

const NoteItem = ({ note }: NoteItemProps) => {
  const navigate = useNavigate(); 
  const statusColor =
    note.status === "Em garantia" ? "text-[#478E2C]" : "text-[#D41414]";

  const handleClick = () => {
      navigate("/note", { state: { note } });
    }

  return (
    <div onClick={handleClick} className="bg-[#724EBF]/30 rounded-xl p-4 shadow text-left transition-transform duration-150 hover:scale-105 md:hover:scale-105">
      <div className="pb-2 mb-2">
        <h3 className="font-bold">{note.title}</h3>
        <p className="text-sm indent-2">{note.store}</p>
      </div>

      <p className="indent-0.5 text-sm"><span className="font-semibold">Compra:</span> {note.purchaseDate}</p>
      <p className="indent-0.5 text-sm mt-0.5"><span className="font-semibold">Tipo:</span> {note.typeNote}</p>

      <div className="border-t flex justify-between items-center mt-4 pt-1.5">
        <span className="font-bold text-lg">
          R$ {note.value.toFixed(2).replace(".", ",")}
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
