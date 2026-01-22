import { useNavigate, useLocation } from "react-router-dom";
import { CircleCheckBig, FileText, CalendarDays, ClockAlert, Store, Phone, ShieldCheck, CircleArrowLeft, User, DollarSign, Clock, XCircle, CheckCircle } from "lucide-react"
import Header from "../components/Header";
import { type Nota } from "../data";
import Swal from "sweetalert2";
import { useToast } from "../contexts/ToastContext";

// Componente da tela da nota
function NoteScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const note = location.state?.note as Nota | undefined;

  // Se não houver nota, redireciona para home
  if (!note) {
    navigate("/home");
    return null;
  }

  // Função para verificar se a nota está na lixeira - sempre verifica diretamente
  const isInTrash = (): boolean => {
    if (!note || !note.id) return false;

    try {
      const trashNotes = JSON.parse(localStorage.getItem("trashNotes") || "[]");
      if (!Array.isArray(trashNotes) || trashNotes.length === 0) {
        return false;
      }

      // Verificar se existe alguma nota na lixeira com o mesmo ID
      // Comparação rigorosa: verifica ID exato
      const found = trashNotes.some((n: Nota) => {
        if (!n || typeof n.id !== 'number') return false;
        // Comparar apenas o ID (número)
        return n.id === note.id;
      });

      return found;
    } catch (error) {
      // Em caso de erro, assume que não está na lixeira
      return false;
    }
  };

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

  // Função para obter ícone do status (igual ao SummaryCard)
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Ativa":
        return CheckCircle;
      case "Vencendo":
        return Clock;
      case "Vencida":
        return XCircle;
      default:
        return CircleCheckBig;
    }
  };

  // Buscar nome do usuário logado
  const loggedUserEmail = localStorage.getItem("loggedUserEmail") || sessionStorage.getItem("loggedUserEmail");
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const loggedUser = users.find((u: { email: string; userName: string }) => u.email === loggedUserEmail);
  const loggedUserName = loggedUser?.userName || note.createdBy;

  // Verificar se há PDF(s) associado(s) (primeiro na lixeira, depois na lista principal)
  const trashPdfs = JSON.parse(localStorage.getItem("trashPdfs") || "{}");
  const pdfs = JSON.parse(localStorage.getItem("notaPdfs") || "{}");
  const pdfDataRaw = isInTrash() ? trashPdfs[note.id] : pdfs[note.id];
  // Normalizar: aceita array ou objeto único (retrocompatibilidade)
  const pdfList: { fileName: string; data: string }[] = !pdfDataRaw
    ? []
    : Array.isArray(pdfDataRaw)
      ? pdfDataRaw
      : [{ fileName: pdfDataRaw.fileName || "PDF anexado", data: pdfDataRaw.data }];
  
  // Carregar dados adicionais para Garantia de Assistência
  const assistanceWarrantyDates = JSON.parse(localStorage.getItem("assistanceWarrantyDates") || "{}");
  const assistanceWarrantyPdfs = JSON.parse(localStorage.getItem("assistanceWarrantyPdfs") || "{}");
  const trashAssistancePdfs = JSON.parse(localStorage.getItem("trashAssistancePdfs") || "{}");
  const assistanceWarrantyDate = assistanceWarrantyDates[note.id];
  const assistanceWarrantyPdfData = isInTrash() 
    ? trashAssistancePdfs[note.id] 
    : assistanceWarrantyPdfs[note.id];
  
  // Carregar dados adicionais para Garantia Estendida (suporta múltiplos anexos)
  const extendedWarrantyDates = JSON.parse(localStorage.getItem("extendedWarrantyDates") || "{}");
  const extendedWarrantyPdfs = JSON.parse(localStorage.getItem("extendedWarrantyPdfs") || "{}");
  const trashExtendedPdfs = JSON.parse(localStorage.getItem("trashExtendedPdfs") || "{}");
  const extendedWarrantyDate = extendedWarrantyDates[note.id];
  const extendedWarrantyRaw = isInTrash() 
    ? trashExtendedPdfs[note.id] 
    : extendedWarrantyPdfs[note.id];
  const extendedWarrantyList: { fileName: string; data: string }[] = !extendedWarrantyRaw
    ? []
    : Array.isArray(extendedWarrantyRaw)
      ? extendedWarrantyRaw
      : [{ fileName: extendedWarrantyRaw.fileName || "PDF anexado", data: extendedWarrantyRaw.data }];
  
  // Verificar se é Garantia de Assistência ou Garantia Estendida
  const isAssistanceWarranty = note.typeNote === "Garantia de Assistência";
  const isExtendedWarranty = note.typeNote === "Garantia Estendida";

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

  // Função para verificar se o arquivo é uma imagem
  const isImageFile = (fileName: string): boolean => {
    const lowerName = fileName.toLowerCase();
    return lowerName.match(/\.(jpg|jpeg|png|gif|webp)$/) !== null;
  };

  // Função para obter extensão do arquivo
  const getFileExtension = (fileName: string): string => {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : '';
  };

  const handleViewPdf = (pdfToView: { fileName: string; data: string }) => {
    const file = pdfToView;
    if (file && file.data) {
      // Converter base64 para blob
      const byteCharacters = atob(file.data.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      
      // Verificar se é imagem ou PDF
      const isImage = isImageFile(file.fileName);
      let mimeType = 'application/pdf';
      if (isImage) {
        const ext = getFileExtension(file.fileName).toLowerCase();
        // Mapear extensões para mimeTypes corretos
        const mimeTypes: { [key: string]: string } = {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'gif': 'image/gif',
          'webp': 'image/webp'
        };
        mimeType = mimeTypes[ext] || `image/${ext}`;
      }
      const blob = new Blob([byteArray], { type: mimeType });

      if (isImage) {
        // Para imagens, fazer download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // Para PDFs, abrir em nova aba
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }
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

        // Salvar PDFs na lixeira também (manter referência)
        const trashPdfs = JSON.parse(localStorage.getItem("trashPdfs") || "{}");
        const trashAssistancePdfs = JSON.parse(localStorage.getItem("trashAssistancePdfs") || "{}");
        const trashExtendedPdfs = JSON.parse(localStorage.getItem("trashExtendedPdfs") || "{}");
        
        if (pdfDataRaw) {
          trashPdfs[note.id] = pdfDataRaw;
          localStorage.setItem("trashPdfs", JSON.stringify(trashPdfs));
        }
        
        // Salvar PDF de assistência na lixeira se existir
        if (isAssistanceWarranty && assistanceWarrantyPdfData) {
          trashAssistancePdfs[note.id] = assistanceWarrantyPdfData;
          localStorage.setItem("trashAssistancePdfs", JSON.stringify(trashAssistancePdfs));
        }
        
        // Salvar PDF(s) de garantia estendida na lixeira se existir(em)
        if (isExtendedWarranty && extendedWarrantyRaw) {
          trashExtendedPdfs[note.id] = extendedWarrantyRaw;
          localStorage.setItem("trashExtendedPdfs", JSON.stringify(trashExtendedPdfs));
        }

        const savedNotas = JSON.parse(localStorage.getItem("notas") || "[]");
        const isFixedNote = note.id <= 4 && !savedNotas.find((n: Nota) => n.id === note.id);

        // Sempre remover de "notas" (notas editadas podem estar em savedNotas)
        const updatedNotas = savedNotas.filter((n: Nota) => n.id !== note.id);
        localStorage.setItem("notas", JSON.stringify(updatedNotas));

        if (isFixedNote) {
          const deletedNotes = JSON.parse(localStorage.getItem("deletedNotes") || "[]");
          if (!deletedNotes.includes(note.id)) {
            deletedNotes.push(note.id);
            localStorage.setItem("deletedNotes", JSON.stringify(deletedNotes));
          }
        }

        // Remover PDFs da lista principal (mas manter na lixeira)
        if (pdfDataRaw) {
          const pdfs = JSON.parse(localStorage.getItem("notaPdfs") || "{}");
          delete pdfs[note.id];
          localStorage.setItem("notaPdfs", JSON.stringify(pdfs));
        }
        
        // Remover PDF de assistência da lista principal se existir
        if (isAssistanceWarranty && assistanceWarrantyPdfData) {
          const assistancePdfs = JSON.parse(localStorage.getItem("assistanceWarrantyPdfs") || "{}");
          delete assistancePdfs[note.id];
          localStorage.setItem("assistanceWarrantyPdfs", JSON.stringify(assistancePdfs));
        }
        
        // Remover PDF(s) de garantia estendida da lista principal se existir(em)
        if (isExtendedWarranty && extendedWarrantyRaw) {
          const extendedPdfs = JSON.parse(localStorage.getItem("extendedWarrantyPdfs") || "{}");
          delete extendedPdfs[note.id];
          localStorage.setItem("extendedWarrantyPdfs", JSON.stringify(extendedPdfs));
        }

        showToast("A nota foi movida para a lixeira com sucesso.", "success");
        
        // Disparar evento customizado para atualizar a Home
        window.dispatchEvent(new Event("notesUpdated"));
        
        setTimeout(() => {
          navigate("/home");
        }, 500);
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

        // Restaurar PDFs se existirem na lixeira
        const trashPdfs = JSON.parse(localStorage.getItem("trashPdfs") || "{}");
        const trashAssistancePdfs = JSON.parse(localStorage.getItem("trashAssistancePdfs") || "{}");
        const trashExtendedPdfs = JSON.parse(localStorage.getItem("trashExtendedPdfs") || "{}");
        
        if (pdfDataRaw) {
          const pdfs = JSON.parse(localStorage.getItem("notaPdfs") || "{}");
          pdfs[note.id] = pdfDataRaw;
          localStorage.setItem("notaPdfs", JSON.stringify(pdfs));

          // Remover da lixeira de PDFs
          delete trashPdfs[note.id];
          localStorage.setItem("trashPdfs", JSON.stringify(trashPdfs));
        }
        
        // Restaurar PDF de assistência se existir na lixeira
        if (isAssistanceWarranty && trashAssistancePdfs[note.id]) {
          const assistancePdfs = JSON.parse(localStorage.getItem("assistanceWarrantyPdfs") || "{}");
          assistancePdfs[note.id] = trashAssistancePdfs[note.id];
          localStorage.setItem("assistanceWarrantyPdfs", JSON.stringify(assistancePdfs));
          
          // Remover da lixeira
          delete trashAssistancePdfs[note.id];
          localStorage.setItem("trashAssistancePdfs", JSON.stringify(trashAssistancePdfs));
        }
        
        // Restaurar PDF de garantia estendida se existir na lixeira
        if (isExtendedWarranty && trashExtendedPdfs[note.id]) {
          const extendedPdfs = JSON.parse(localStorage.getItem("extendedWarrantyPdfs") || "{}");
          extendedPdfs[note.id] = trashExtendedPdfs[note.id];
          localStorage.setItem("extendedWarrantyPdfs", JSON.stringify(extendedPdfs));
          
          // Remover da lixeira
          delete trashExtendedPdfs[note.id];
          localStorage.setItem("trashExtendedPdfs", JSON.stringify(trashExtendedPdfs));
        }

        // Adicionar nota de volta ao localStorage
        const savedNotas = JSON.parse(localStorage.getItem("notas") || "[]");
        
        // Verificar se a nota já existe no array (evitar duplicatas)
        if (!savedNotas.find((n: Nota) => n.id === note.id)) {
          savedNotas.push(note);
          localStorage.setItem("notas", JSON.stringify(savedNotas));
        }
        
        // Remover do array de deletadas se existir (para compatibilidade com notas antigas)
        const deletedNotes = JSON.parse(localStorage.getItem("deletedNotes") || "[]");
        if (deletedNotes.includes(note.id)) {
          const updatedDeletedNotes = deletedNotes.filter((id: number) => id !== note.id);
          localStorage.setItem("deletedNotes", JSON.stringify(updatedDeletedNotes));
        }

        showToast("A nota foi restaurada com sucesso.", "success");
        
        // Disparar evento customizado para atualizar a Home
        window.dispatchEvent(new Event("notesUpdated"));
        
        setTimeout(() => {
          navigate("/trash");
        }, 500);
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
            {(() => {
              const StatusIcon = getStatusIcon(note.status);
              return <StatusIcon className="w-4 h-4 md:w-5 md:h-5" />;
            })()}
            <p className="font-medium text-ts md:text-sm lg:text-base">{note.status}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10">

          {/* Image Note */}
          <div className="flex flex-col items-center">
            <div className="w-full bg-[#724EBF]/30 rounded-2xl py-25 sm:py-28 md:py-30 xl:py-35 flex items-center justify-center">
              <FileText className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" />
            </div>

            {/* Arquivos disponíveis */}
            <div className="mt-2 md:mt-3 flex flex-col gap-2 items-center">
              {pdfList.length > 0 ? (
                pdfList.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleViewPdf(item)}
                    className="font-semibold hover:underline text-sm md:text-base lg:text-lg transition text-[#724EBF]"
                  >
                    Visualizar Nota Fiscal{pdfList.length > 1 ? ` ${i + 1}` : ""}
                    {isImageFile(item.fileName) ? ` (${getFileExtension(item.fileName)})` : " (PDF)"}
                  </button>
                ))
              ) : (
                <p className="text-sm md:text-base lg:text-lg text-gray-400">
                  Nenhum arquivo anexado
                </p>
              )}
              
              {/* Arquivo de Garantia de Assistência */}
              {isAssistanceWarranty && assistanceWarrantyPdfData && (
                <button
                  onClick={() => handleViewPdf(assistanceWarrantyPdfData)}
                  className="font-semibold hover:underline text-sm md:text-base lg:text-lg transition text-[#724EBF]"
                >
                  Visualizar Garantia de Assistência{isImageFile(assistanceWarrantyPdfData.fileName) ? ` (${getFileExtension(assistanceWarrantyPdfData.fileName)})` : ' (PDF)'}
                </button>
              )}
              
              {/* Arquivos de Garantia Estendida (múltiplos) */}
              {isExtendedWarranty && extendedWarrantyList.length > 0 && extendedWarrantyList.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleViewPdf(item)}
                  className="font-semibold hover:underline text-sm md:text-base lg:text-lg transition text-[#724EBF] block text-left"
                >
                  Visualizar Garantia Estendida{extendedWarrantyList.length > 1 ? ` ${idx + 1}` : ""}{isImageFile(item.fileName) ? ` (${getFileExtension(item.fileName)})` : " (PDF)"} – {item.fileName}
                </button>
              ))}
            </div>
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

              {/* Data do Fim da Garantia de Assistência - apenas se for Garantia de Assistência */}
              {isAssistanceWarranty && assistanceWarrantyDate && (
                <div className="flex flex-row items-start gap-2">
                  <ClockAlert color="#724EBF" size={35} className="shrink-0" />
                  <div className="flex flex-col">
                    <p className="font-semibold text-sm md:text-base">Fim da Garantia de Assistência:</p>
                    <p className="text-sm md:text-base">{assistanceWarrantyDate}</p>
                  </div>
                </div>
              )}

              {/* Data do Fim da Garantia Estendida - apenas se for Garantia Estendida */}
              {isExtendedWarranty && extendedWarrantyDate && (
                <div className="flex flex-row items-start gap-2">
                  <ClockAlert color="#724EBF" size={35} className="shrink-0" />
                  <div className="flex flex-col">
                    <p className="font-semibold text-sm md:text-base">Fim da Garantia Estendida:</p>
                    <p className="text-sm md:text-base">{extendedWarrantyDate}</p>
                  </div>
                </div>
              )}

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
          <label htmlFor="notes" className="font-semibold text-xl md:text-2xl mb-2 md:mb-3">Observações</label>
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
              onClick={isInTrash() ? handleRestoreNote : handleDeleteNote}
              className={isInTrash() ? `
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
              {isInTrash() ? "restaurar" : "Mover para Lixeira"}
            </button>
          </div>
        </div>

      </div>

    </div>
  )
}

export default NoteScreen;
