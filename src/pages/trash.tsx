import { useEffect, useState } from "react";
import Header from "../components/Header.tsx";
import TrashNoteItem from "../components/TrashNoteItem.tsx";
import { Trash2, RotateCcw, XCircle } from "lucide-react";
import { type Nota } from "../data";
import Swal from "sweetalert2";
import { useToast } from "../contexts/ToastContext";

const Trash = () => {
  const { showToast } = useToast();
  const [deletedNotes, setDeletedNotes] = useState<Nota[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<Set<number>>(new Set());

  const loadTrashNotes = () => {
    const savedDeletedNotes = JSON.parse(localStorage.getItem("trashNotes") || "[]");
    setDeletedNotes(savedDeletedNotes);
    setSelectedNotes(new Set()); // Limpar seleção ao recarregar
  };

  useEffect(() => {
    loadTrashNotes();
  }, []);

  // Atualizar quando voltar para a página ou when notesUpdated
  useEffect(() => {
    const handleReload = () => {
      loadTrashNotes();
    };

    window.addEventListener("storage", handleReload);
    window.addEventListener("focus", handleReload);
    window.addEventListener("notesUpdated", handleReload);

    return () => {
      window.removeEventListener("storage", handleReload);
      window.removeEventListener("focus", handleReload);
      window.removeEventListener("notesUpdated", handleReload);
    };
  }, []);

  const handleSelectNote = (noteId: number, selected: boolean) => {
    const newSelected = new Set(selectedNotes);
    if (selected) {
      newSelected.add(noteId);
    } else {
      newSelected.delete(noteId);
    }
    setSelectedNotes(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedNotes.size === deletedNotes.length) {
      setSelectedNotes(new Set());
    } else {
      setSelectedNotes(new Set(deletedNotes.map(n => n.id)));
    }
  };

  const handleRestoreSelected = () => {
    if (selectedNotes.size === 0) return;

    Swal.fire({
      title: "Restaurar Notas?",
      text: `${selectedNotes.size} nota(s) será(ão) restaurada(s) e voltará(ão) para a lista principal.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#478E2C",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sim, restaurar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const trashNotes = JSON.parse(localStorage.getItem("trashNotes") || "[]");
        const savedNotas = JSON.parse(localStorage.getItem("notas") || "[]");
        const deletedNotesIds = JSON.parse(localStorage.getItem("deletedNotes") || "[]");
        const trashPdfs = JSON.parse(localStorage.getItem("trashPdfs") || "{}");
        const trashAssistancePdfs = JSON.parse(localStorage.getItem("trashAssistancePdfs") || "{}");
        const trashExtendedPdfs = JSON.parse(localStorage.getItem("trashExtendedPdfs") || "{}");
        const pdfs = JSON.parse(localStorage.getItem("notaPdfs") || "{}");
        const assistancePdfs = JSON.parse(localStorage.getItem("assistanceWarrantyPdfs") || "{}");
        const extendedPdfs = JSON.parse(localStorage.getItem("extendedWarrantyPdfs") || "{}");

        const notesToRestore = trashNotes.filter((n: Nota) => selectedNotes.has(n.id));
        const updatedTrashNotes = trashNotes.filter((n: Nota) => !selectedNotes.has(n.id));

        // Restaurar cada nota
        notesToRestore.forEach((note: Nota) => {
          // Adicionar nota de volta ao localStorage
          if (!savedNotas.find((n: Nota) => n.id === note.id)) {
            savedNotas.push(note);
          }
          
          // Remover do array de deletadas se existir (para compatibilidade com notas antigas)
          const index = deletedNotesIds.indexOf(note.id);
          if (index > -1) {
            deletedNotesIds.splice(index, 1);
          }

          // Restaurar PDFs se existirem
          if (trashPdfs[note.id]) {
            pdfs[note.id] = trashPdfs[note.id];
            delete trashPdfs[note.id];
          }
          
          // Restaurar PDF de assistência se existir
          if (trashAssistancePdfs[note.id]) {
            assistancePdfs[note.id] = trashAssistancePdfs[note.id];
            delete trashAssistancePdfs[note.id];
          }
          
          // Restaurar PDF de garantia estendida se existir
          if (trashExtendedPdfs[note.id]) {
            extendedPdfs[note.id] = trashExtendedPdfs[note.id];
            delete trashExtendedPdfs[note.id];
          }
        });

        localStorage.setItem("trashNotes", JSON.stringify(updatedTrashNotes));
        localStorage.setItem("notas", JSON.stringify(savedNotas));
        localStorage.setItem("deletedNotes", JSON.stringify(deletedNotesIds));
        localStorage.setItem("trashPdfs", JSON.stringify(trashPdfs));
        localStorage.setItem("trashAssistancePdfs", JSON.stringify(trashAssistancePdfs));
        localStorage.setItem("trashExtendedPdfs", JSON.stringify(trashExtendedPdfs));
        localStorage.setItem("notaPdfs", JSON.stringify(pdfs));
        localStorage.setItem("assistanceWarrantyPdfs", JSON.stringify(assistancePdfs));
        localStorage.setItem("extendedWarrantyPdfs", JSON.stringify(extendedPdfs));

        loadTrashNotes();

        // Disparar evento customizado para atualizar a Home
        window.dispatchEvent(new Event("notesUpdated"));

        showToast(`${notesToRestore.length} nota(s) foi(ram) restaurada(s) com sucesso.`, "success");
      }
    });
  };

  const handleDeletePermanently = () => {
    if (selectedNotes.size === 0) return;

    Swal.fire({
      title: "Excluir Permanentemente?",
      text: `${selectedNotes.size} nota(s) será(ão) excluída(s) permanentemente. Esta ação não pode ser desfeita!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D41414",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sim, excluir permanentemente",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const trashNotes = JSON.parse(localStorage.getItem("trashNotes") || "[]");
        const trashPdfs = JSON.parse(localStorage.getItem("trashPdfs") || "{}");
        const trashAssistancePdfs = JSON.parse(localStorage.getItem("trashAssistancePdfs") || "{}");
        const trashExtendedPdfs = JSON.parse(localStorage.getItem("trashExtendedPdfs") || "{}");
        const updatedTrashNotes = trashNotes.filter((n: Nota) => !selectedNotes.has(n.id));

        selectedNotes.forEach((noteId) => {
          delete trashPdfs[noteId];
          delete trashAssistancePdfs[noteId];
          delete trashExtendedPdfs[noteId];
        });

        // Remover também de "notas" para que não voltem à Home (ex.: dados antigos que ficaram em ambos)
        const savedNotas = JSON.parse(localStorage.getItem("notas") || "[]");
        const updatedNotas = savedNotas.filter((n: Nota) => !selectedNotes.has(n.id));
        localStorage.setItem("notas", JSON.stringify(updatedNotas));

        localStorage.setItem("trashNotes", JSON.stringify(updatedTrashNotes));
        localStorage.setItem("trashPdfs", JSON.stringify(trashPdfs));
        localStorage.setItem("trashAssistancePdfs", JSON.stringify(trashAssistancePdfs));
        localStorage.setItem("trashExtendedPdfs", JSON.stringify(trashExtendedPdfs));

        loadTrashNotes();
        window.dispatchEvent(new Event("notesUpdated"));

        showToast(`${selectedNotes.size} nota(s) foi(ram) excluída(s) permanentemente.`, "success");
      }
    });
  };

  const handleEmptyTrash = () => {
    if (deletedNotes.length === 0) return;

    Swal.fire({
      title: "Esvaziar Lixeira?",
      text: `Todas as ${deletedNotes.length} nota(s) serão excluídas permanentemente. Esta ação não pode ser desfeita!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D41414",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sim, esvaziar lixeira",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // IDs das notas que serão excluídas (antes de limpar a lixeira)
        const idsToRemove = new Set(deletedNotes.map((n: Nota) => n.id));
        // Remover de "notas" para que não voltem à Home
        const savedNotas = JSON.parse(localStorage.getItem("notas") || "[]");
        const updatedNotas = savedNotas.filter((n: Nota) => !idsToRemove.has(n.id));
        localStorage.setItem("notas", JSON.stringify(updatedNotas));

        localStorage.setItem("trashNotes", JSON.stringify([]));
        localStorage.setItem("trashPdfs", JSON.stringify({}));
        localStorage.setItem("trashAssistancePdfs", JSON.stringify({}));
        localStorage.setItem("trashExtendedPdfs", JSON.stringify({}));

        loadTrashNotes();
        window.dispatchEvent(new Event("notesUpdated"));

        showToast("Todas as notas foram excluídas permanentemente.", "success");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      {/* Título da Página e Barra de Ações */}
      <div className="w-full px-5 sm:px-15 mt-5 mb-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Trash2 size={24} /> Lixeira
          </h1>

          {deletedNotes.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <button
                onClick={handleSelectAll}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                {selectedNotes.size === deletedNotes.length ? "Desselecionar Todas" : "Selecionar Todas"}
              </button>

              {selectedNotes.size > 0 && (
                <>
                  <button
                    onClick={handleRestoreSelected}
                    className="px-4 py-2 text-sm font-medium text-[#478E2C] bg-white border-2 border-[#478E2C] rounded-lg hover:bg-green-50 transition flex items-center gap-2"
                  >
                    <RotateCcw size={16} />
                    Restaurar ({selectedNotes.size})
                  </button>
                  <button
                    onClick={handleDeletePermanently}
                    className="px-4 py-2 text-sm font-medium text-[#D41414] bg-white border-2 border-[#D41414] rounded-lg hover:bg-red-50 transition flex items-center gap-2"
                  >
                    <XCircle size={16} />
                    Excluir ({selectedNotes.size})
                  </button>
                </>
              )}

              <button
                onClick={handleEmptyTrash}
                className="px-4 py-2 text-sm font-medium text-[#D41414] bg-white border-2 border-[#D41414] rounded-lg hover:bg-red-50 transition flex items-center gap-2"
              >
                <Trash2 size={16} />
                Esvaziar Lixeira
              </button>
            </div>
          )}
        </div>
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
            Aparelhos excluídos aparecerão aqui e poderão ser restaurados ou excluídos permanentemente.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 px-9">
          {deletedNotes.map((note) => (
            <TrashNoteItem
              key={note.id}
              note={note}
              isSelected={selectedNotes.has(note.id)}
              onSelect={handleSelectNote}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Trash;
