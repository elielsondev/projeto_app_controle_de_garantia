const NoteItem = ({ note }) => {
  const statusColor =
    note.status === "Em garantia" ? "text-green-500" : "text-red-500";

  return (
    <div className="bg-purple-100 rounded-xl p-4 shadow mb-4">
      <div className="border-b pb-2 mb-2">
        <h3 className="font-semibold">{note.titulo}</h3>
        <p className="text-sm">{note.fornecedor}</p>
      </div>

      <p className="text-sm">Compra: {note.compraData}</p>
      <p className="text-sm">Tipo: {note.tipoNota}</p>

      <div className="flex justify-between items-center mt-3">
        <span className="font-bold text-lg">
          R$ {note.valor.toFixed(2).replace(".", ",")}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-sm text-black font-bold ${statusColor}`}
        >
          {note.status}
        </span>
      </div>
    </div>
  );
};

export default NoteItem;
