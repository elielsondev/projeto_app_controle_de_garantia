import { useNavigate, useLocation } from "react-router-dom";
import { CircleCheckBig, FileText, CalendarDays, ClockAlert, Store, Phone, ShieldCheck, CircleArrowLeft, User, DollarSign } from "lucide-react"
import Header from "../components/Header";
import { type Nota } from "../data";
import Swal from "sweetalert2";

// Componente da tela da nota
function NoteScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const note = location.state?.note as Nota | undefined;

  // Se não houver nota, redireciona para home
  if (!note) {
    navigate("/home");
    return null;
  }

  const handleClick = () => {
    navigate("/home");
  };

  // Função para obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativa":
        return "bg-[#558941]/15 text-[#478E2C]";
      case "Vencendo":
        return "bg-[#CA8A04]/15 text-[#CA8A04]";
      case "Vencida":
        return "bg-[#D41414]/15 text-[#D41414]";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Buscar nome do usuário logado
  const loggedUserEmail = localStorage.getItem("loggedUserEmail") || sessionStorage.getItem("loggedUserEmail");
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const loggedUser = users.find((u: { email: string; userName: string }) => u.email === loggedUserEmail);
  const loggedUserName = loggedUser?.userName || note.createdBy;

  // Verificar se a nota está na lixeira
  const trashNotes = JSON.parse(localStorage.getItem("trashNotes") || "[]");
  const isInTrash = trashNotes.some((n: Nota) => n.id === note.id);

  // Verificar se há PDF associado (primeiro na lixeira, depois na lista principal)
  const trashPdfs = JSON.parse(localStorage.getItem("trashPdfs") || "{}");
  const pdfs = JSON.parse(localStorage.getItem("notaPdfs") || "{}");
  const pdfData = isInTrash ? trashPdfs[note.id] : pdfs[note.id];

  // Função para formatar telefone brasileiro
  const formatPhone = (phone: string): string => {
    if (!phone) return "";
    // Remove tudo que não é número
    const numbers = phone.replace(/\D/g, "");
    
    // Formata conforme o tamanho
    if (numbers.length === 10) {
      // Telefone fixo: (XX) XXXX-XXXX
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else if (numbers.length === 11) {
      // Celular: (XX) XXXXX-XXXX
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    }
    // Se não tiver 10 ou 11 dígitos, retorna o original
    return phone;
  };

  // Função para formatar valor monetário brasileiro
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleViewPdf = () => {
    if (pdfData && pdfData.data) {
      // Converter base64 para blob
      const byteCharacters = atob(pdfData.data.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      // Criar URL do blob e abrir em nova aba
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');

      // Limpar a URL após um tempo para liberar memória
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }
  };

  const handleDeleteNote = () => {
    Swal.fire({
      title: "Mover para Lixeira?",
      text: "A nota será movida para a lixeira e poderá ser restaurada depois.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D41414",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sim, mover para lixeira",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Salvar a nota na lixeira (trashNotes)
        const trashNotes = JSON.parse(localStorage.getItem("trashNotes") || "[]");
        // Verificar se a nota já não está na lixeira
        if (!trashNotes.find((n: Nota) => n.id === note.id)) {
          trashNotes.push(note);
          localStorage.setItem("trashNotes", JSON.stringify(trashNotes));
        }

        // Salvar PDF na lixeira também (manter referência)
        if (pdfData) {
          const trashPdfs = JSON.parse(localStorage.getItem("trashPdfs") || "{}");
          trashPdfs[note.id] = pdfData;
          localStorage.setItem("trashPdfs", JSON.stringify(trashPdfs));
        }

        // Verificar se é uma nota fixa (id <= 4) ou uma nota do localStorage
        const savedNotas = JSON.parse(localStorage.getItem("notas") || "[]");
        const isFixedNote = note.id <= 4 && !savedNotas.find((n: Nota) => n.id === note.id);

        if (isFixedNote) {
          // Se for uma nota fixa, adicionar ao array de deletadas
          const deletedNotes = JSON.parse(localStorage.getItem("deletedNotes") || "[]");
          if (!deletedNotes.includes(note.id)) {
            deletedNotes.push(note.id);
            localStorage.setItem("deletedNotes", JSON.stringify(deletedNotes));
          }
        } else {
          // Se for uma nota do localStorage, remover normalmente
          const updatedNotas = savedNotas.filter((n: Nota) => n.id !== note.id);
          localStorage.setItem("notas", JSON.stringify(updatedNotas));
        }

        // Remover PDF da lista principal (mas manter na lixeira)
        if (pdfData) {
          const pdfs = JSON.parse(localStorage.getItem("notaPdfs") || "{}");
          delete pdfs[note.id];
          localStorage.setItem("notaPdfs", JSON.stringify(pdfs));
        }

        Swal.fire({
          title: "Movida para Lixeira!",
          text: "A nota foi movida para a lixeira com sucesso.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/home");
        });
      }
    });
  };

  const handleRestoreNote = () => {
    Swal.fire({
      title: "Restaurar Nota?",
      text: "A nota será restaurada e voltará para a lista principal.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#478E2C",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sim, restaurar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Remover da lixeira
        const trashNotes = JSON.parse(localStorage.getItem("trashNotes") || "[]");
        const updatedTrashNotes = trashNotes.filter((n: Nota) => n.id !== note.id);
        localStorage.setItem("trashNotes", JSON.stringify(updatedTrashNotes));

        // Restaurar PDF se existir na lixeira
        if (pdfData) {
          const pdfs = JSON.parse(localStorage.getItem("notaPdfs") || "{}");
          pdfs[note.id] = pdfData;
          localStorage.setItem("notaPdfs", JSON.stringify(pdfs));

          // Remover da lixeira de PDFs
          const trashPdfs = JSON.parse(localStorage.getItem("trashPdfs") || "{}");
          delete trashPdfs[note.id];
          localStorage.setItem("trashPdfs", JSON.stringify(trashPdfs));
        }

        // Verificar se é uma nota fixa (id <= 4) ou uma nota do localStorage
        const savedNotas = JSON.parse(localStorage.getItem("notas") || "[]");
        const isFixedNote = note.id <= 4 && !savedNotas.find((n: Nota) => n.id === note.id);

        if (isFixedNote) {
          // Se for uma nota fixa, remover do array de deletadas
          const deletedNotes = JSON.parse(localStorage.getItem("deletedNotes") || "[]");
          const updatedDeletedNotes = deletedNotes.filter((id: number) => id !== note.id);
          localStorage.setItem("deletedNotes", JSON.stringify(updatedDeletedNotes));
        } else {
          // Se for uma nota do localStorage, adicionar de volta
          if (!savedNotas.find((n: Nota) => n.id === note.id)) {
            savedNotas.push(note);
            localStorage.setItem("notas", JSON.stringify(savedNotas));
          }
        }

        Swal.fire({
          title: "Restaurada!",
          text: "A nota foi restaurada com sucesso.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/trash");
        });
      }
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />
      <div className="w-full px-5 sm:px-6 md:px-10 xl:px-20 pb-6 md:pb-10">
        {/* Stats */}
        <div className="relative flex items-center justify-center py-6 md:py-10">
          {/* Botão de Voltar - Apenas Mobile */}
          <button
            onClick={handleClick}
            className="md:hidden absolute left-0 flex items-center gap-2 text-[#724EBF] hover:text-[#5a3a9f] transition"
          >
            <CircleArrowLeft className="w-6 h-6" />
            <span className="font-medium">Voltar</span>
          </button>

          <div className={`
          flex items-center gap-2 p-3 px-4 py-2 md:p-3 
          rounded-full ${getStatusColor(note.status)}
          shadow transition duration-300 ease-out hover:-translate-y-1
        `}>
            <CircleCheckBig className="w-4 h-4 md:w-5 md:h-5" />
            <p className="font-medium text-ts md:text-sm lg:text-base">{note.status}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10">

          {/* Image Note */}
          <div className="flex flex-col items-center">
            <div className="w-full bg-[#724EBF]/30 rounded-2xl py-25 sm:py-28 md:py-30 xl:py-35 flex items-center justify-center">
              <FileText className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" />
            </div>

            {pdfData ? (
              <button
                onClick={handleViewPdf}
                className="mt-2 md:mt-3 font-semibold hover:underline text-sm md:text-base lg:text-lg transition text-[#724EBF]"
              >
                Visualizar em PDF
              </button>
            ) : (
              <p className="mt-2 md:mt-3 text-sm md:text-base lg:text-lg text-gray-400">
                Nenhum PDF anexado
              </p>
            )}
          </div>

          <div className="">
            {/* Details Note */}
            <h1 className="font-semibold text-2xl sm:text-3xl lg:text-4xl">{note.title}</h1>
            <p className="mt-1 text-sm md:text-base">
              <span className="font-semibold mr-2">Número da Nota:</span>
              {note.numeroNota}
            </p>
            <div className="grid grid-cols-2 mx-7 text-start gap-y-10">

              {/* Purchase Date */}
              <div className="flex flex-row items-start gap-2 mt-10">
                <CalendarDays color="#724EBF" size={35} className="shrink-0" />
                <div className="flex flex-col">
                  <p className="font-semibold text-sm md:text-base">Data de Compra:</p>
                  <p className="text-sm md:text-base">{note.purchaseDate}</p>
                </div>
              </div>

              <div className="flex flex-row items-start gap-2 mt-10">
                <ClockAlert color="#724EBF" size={35} className="shrink-0" />
                <div className="flex flex-col">
                  <p className="font-semibold text-sm md:text-base">Fim da Garantia:</p>
                  <p className="text-sm md:text-base">{note.dueDate}</p>
                </div>
              </div>

              <div className="flex flex-row items-start gap-2">
                <Store color="#724EBF" size={35} className="shrink-0" />
                <div className="flex flex-col">
                  <p className="font-semibold text-sm md:text-base">Loja:</p>
                  <p className="text-sm md:text-base">{note.store}</p>
                </div>
              </div>

              {note.phone && (
                <div className="flex flex-row items-start gap-2">
                  <Phone color="#724EBF" size={35} className="shrink-0" />
                  <div className="flex flex-col">
                    <p className="font-semibold text-sm md:text-base">Contato da Loja:</p>
                    <p className="text-sm md:text-base">{formatPhone(note.phone)}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-row items-start gap-2">
                <DollarSign color="#724EBF" size={35} className="shrink-0" />
                <div className="flex flex-col">
                  <p className="font-semibold text-sm md:text-base">Valor:</p>
                  <p className="text-sm md:text-base">{formatCurrency(note.value)}</p>
                </div>
              </div>

              <div className="flex flex-row items-start gap-2">
                <ShieldCheck color="#724EBF" size={35} className="shrink-0" />
                <div className="flex flex-col">
                  <p className="font-semibold text-sm md:text-base">Tipo de Garantia:</p>
                  <p className="text-sm md:text-base">{note.typeNote}</p>
                </div>
              </div>

              <div className="flex flex-row items-start gap-2">
                <User color="#724EBF" size={35} className="shrink-0" />
                <div className="flex flex-col">
                  <p className="font-semibold text-sm md:text-base">Nota Criada Por:</p>
                  <p className="text-sm md:text-base">{loggedUserName}</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="flex flex-col mt-8 md:mt-12">
          <label htmlFor="notes" className="font-semibold text-xl md:text-2xl mb-2 md:mb-3">Observações:</label>
          <textarea
            name="notes"
            rows={5}
            readOnly
            value={note.observations || ""}
            className="w-full p-3 md:p-4 border border-gray-300 rounded-md text-sm md:text-base resize-none"
            placeholder="Nenhuma observação registrada."
          />
          <div className="flex flex-col sm:flex-row justify-start sm:justify-end gap-3 md:gap-4 mt-4 md:mt-5">
            <button
              onClick={() => {
                navigate("/registration-note", { state: { note } });
              }}
              className="
              border-2 border-[#724EBF]
              text-[#724EBF] font-medium
              px-10
              py-2
              rounded-3xl
              hover:bg-violet-300
              hover:border-violet-300 
              transition
            ">
              Editar
            </button>

            <button
              onClick={isInTrash ? handleRestoreNote : handleDeleteNote}
              className={isInTrash ? `
              border-2 border-[#478E2C]
              text-[#478E2C] font-medium
              px-10
              py-2
              rounded-3xl
              hover:bg-green-200
              hover:border-green-200
              transition
            ` : `
              border-2 border-[#D41414]
              text-[#D41414] font-medium
              px-10
              py-2
              rounded-3xl
              hover:bg-red-200
              hover:border-red-200
              transition
            `}
            >
              {isInTrash ? "Restaurar Nota" : "Mover para Lixeira"}
            </button>
          </div>
        </div>

      </div>

    </div>
  )
}

export default NoteScreen;
