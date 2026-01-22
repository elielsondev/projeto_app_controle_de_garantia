import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Upload, X, CircleArrowLeft } from "lucide-react";
import Header from "../components/Header";
import { useToast } from "../contexts/ToastContext";
import { notas } from "../data";
import type { Nota } from "../data";

type PdfListItem = { file?: File; fileName: string; data?: string };

function RegistrationNote() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const noteToEdit = location.state?.note as Nota | undefined;
  const isEditMode = !!noteToEdit;

  const [formData, setFormData] = useState({
    numeroNota: "",
    title: "",
    store: "",
    purchaseDate: "",
    dueDate: "",
    phone: "",
    observations: "",
    typeNote: "",
    value: "",
    extendedWarrantyDate: "", // Data fim garantia estendida
    assistanceWarrantyDate: "", // Data fim garantia de assistência
  });
  // Lista de notas fiscais (permite múltiplos anexos)
  const [pdfFileList, setPdfFileList] = useState<PdfListItem[]>([]);
  
  // Lista de anexos de garantia estendida (permite múltiplos)
  const [extendedWarrantyFileList, setExtendedWarrantyFileList] = useState<PdfListItem[]>([]);
  
  // Variáveis mantidas para compatibilidade com notas antigas que podem ter "Garantia de Assistência"
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [assistanceWarrantyPdf] = useState<File | null>(null);
  const [assistanceWarrantyPdfName, setAssistanceWarrantyPdfName] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasExistingAssistancePdf, setHasExistingAssistancePdf] = useState(false);

  // Função para formatar valor ao carregar
  const formatValueForInput = (value: number): string => {
    if (!value) return "";
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Carregar dados da nota se estiver editando
  useEffect(() => {
    if (noteToEdit) {
      // Converter datas de DD/MM/YYYY para YYYY-MM-DD
      const convertDateToInput = (dateStr: string): string => {
        const [day, month, year] = dateStr.split("/");
        return `${year}-${month}-${day}`;
      };

      // Carregar datas adicionais
      const extendedWarrantyDates = JSON.parse(localStorage.getItem("extendedWarrantyDates") || "{}");
      const assistanceWarrantyDates = JSON.parse(localStorage.getItem("assistanceWarrantyDates") || "{}");
      
      const extendedDate = extendedWarrantyDates[noteToEdit.id] ? convertDateToInput(extendedWarrantyDates[noteToEdit.id]) : "";
      const assistanceDate = assistanceWarrantyDates[noteToEdit.id] ? convertDateToInput(assistanceWarrantyDates[noteToEdit.id]) : "";

      setFormData({
        numeroNota: noteToEdit.numeroNota || "",
        title: noteToEdit.title || "",
        store: noteToEdit.store || "",
        purchaseDate: noteToEdit.purchaseDate ? convertDateToInput(noteToEdit.purchaseDate) : "",
        dueDate: noteToEdit.dueDate ? convertDateToInput(noteToEdit.dueDate) : "",
        phone: noteToEdit.phone || "",
        observations: noteToEdit.observations || "",
        typeNote: noteToEdit.typeNote || "",
        value: formatValueForInput(noteToEdit.value),
        extendedWarrantyDate: extendedDate,
        assistanceWarrantyDate: assistanceDate,
      });

      // Verificar se há PDFs existentes
      const pdfs = JSON.parse(localStorage.getItem("notaPdfs") || "{}");
      const extendedWarrantyPdfs = JSON.parse(localStorage.getItem("extendedWarrantyPdfs") || "{}");
      const assistanceWarrantyPdfs = JSON.parse(localStorage.getItem("assistanceWarrantyPdfs") || "{}");
      
      if (pdfs[noteToEdit.id]) {
        const raw = pdfs[noteToEdit.id];
        const list = Array.isArray(raw) ? raw : [{ fileName: raw.fileName || "PDF anexado", data: raw.data }];
        setPdfFileList(list.map((f: { fileName: string; data: string }) => ({ fileName: f.fileName, data: f.data })));
      }
      
      if (extendedWarrantyPdfs[noteToEdit.id]) {
        const raw = extendedWarrantyPdfs[noteToEdit.id];
        const list = Array.isArray(raw) ? raw : [{ fileName: raw.fileName || "PDF anexado", data: raw.data }];
        setExtendedWarrantyFileList(list.map((f: { fileName: string; data: string }) => ({ fileName: f.fileName, data: f.data })));
      }
      
      if (assistanceWarrantyPdfs[noteToEdit.id]) {
        setHasExistingAssistancePdf(true);
        setAssistanceWarrantyPdfName(assistanceWarrantyPdfs[noteToEdit.id].fileName || "PDF anexado");
      }
    }
  }, [noteToEdit]);

  // Função para formatar telefone durante a digitação
  const formatPhoneInput = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");

    // Limita a 11 dígitos (celular)
    const limitedNumbers = numbers.slice(0, 11);

    // Formata conforme o tamanho
    if (limitedNumbers.length <= 2) {
      return limitedNumbers ? `(${limitedNumbers}` : "";
    } else if (limitedNumbers.length <= 6) {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
    } else if (limitedNumbers.length <= 10) {
      // Telefone fixo: (XX) XXXX-XXXX
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 6)}-${limitedNumbers.slice(6)}`;
    } else {
      // Celular: (XX) XXXXX-XXXX
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7, 11)}`;
    }
  };

  // Função para formatar valor monetário durante a digitação
  const formatCurrencyInput = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");

    if (!numbers) return "";

    // Converte para número e divide por 100 para ter centavos
    const amount = parseFloat(numbers) / 100;

    // Formata como moeda brasileira
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Aplicar formatação específica para telefone e valor
    if (name === "phone") {
      setFormData((prev) => ({
        ...prev,
        [name]: formatPhoneInput(value),
      }));
    } else if (name === "value") {
      setFormData((prev) => ({
        ...prev,
        [name]: formatCurrencyInput(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      const toAdd: PdfListItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isValidType = file.type === "application/pdf" || file.type.startsWith("image/");
        if (isValidType) toAdd.push({ file, fileName: file.name });
        else showToast(`"${file.name}": use apenas PDF ou imagens`, "error");
      }
      if (toAdd.length) setPdfFileList((prev) => [...prev, ...toAdd]);
      e.target.value = "";
    }
  };

  const removePdfFromList = (index: number) => {
    setPdfFileList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExtendedWarrantyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      const toAdd: PdfListItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isValidType = file.type === "application/pdf" || file.type.startsWith("image/");
        if (isValidType) toAdd.push({ file, fileName: file.name });
        else showToast(`"${file.name}": use apenas PDF ou imagens`, "error");
      }
      if (toAdd.length) setExtendedWarrantyFileList((prev) => [...prev, ...toAdd]);
      e.target.value = "";
    }
  };

  const removeExtendedWarrantyFromList = (index: number) => {
    setExtendedWarrantyFileList((prev) => prev.filter((_, i) => i !== index));
  };

  // Função para determinar o tipo de arquivo e retornar estilo/ícone
  const getFileTypeInfo = (fileName: string, file?: File | null) => {
    const lowerName = fileName.toLowerCase();
    const fileType = file?.type || "";
    
    // Verificar se é imagem
    if (fileType.startsWith("image/") || lowerName.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      const extension = lowerName.split('.').pop()?.toUpperCase() || "IMG";
      return {
        label: extension,
        bgColor: "bg-blue-100",
        textColor: "text-blue-600"
      };
    }
    
    // Se não for imagem, é PDF
    return {
      label: "PDF",
      bgColor: "bg-red-100",
      textColor: "text-red-600"
    };
  };

  const formatDate = (dateString: string): string => {
    // Converte de YYYY-MM-DD para DD/MM/YYYY
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const getCurrentDateFormatted = (): string => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const calculateStatus = (dueDate: string): "Ativa" | "Vencida" | "Vencendo" => {
    const [day, month, year] = dueDate.split("/").map(Number);
    const due = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysUntilDue = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) return "Vencida";
    if (daysUntilDue <= 30) return "Vencendo";
    return "Ativa";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação dos campos obrigatórios
    if (!formData.numeroNota || !formData.title || !formData.store || !formData.purchaseDate || !formData.dueDate || !formData.typeNote || !formData.value) {
      showToast("Por favor, preencha todos os campos marcados com *", "warning");
      return;
    }

    // Buscar email do usuário logado
    const loggedUserEmail = localStorage.getItem("loggedUserEmail") || sessionStorage.getItem("loggedUserEmail");

    if (!loggedUserEmail) {
      showToast("Usuário não identificado. Por favor, faça login novamente.", "error");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }

    // Buscar dados do usuário
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: { email: string; userName: string }) => u.email === loggedUserEmail);
    const createdBy = user?.userName || loggedUserEmail || "Usuário";

    const savedNotas = JSON.parse(localStorage.getItem("notas") || "[]");
    const allNotas = [...notas, ...savedNotas];

    let updatedNote: Nota;

    if (isEditMode && noteToEdit) {
      // Modo de edição - atualizar nota existente
      // Atualiza o createdBy com o nome da última pessoa que editou
      updatedNote = {
        ...noteToEdit,
        numeroNota: formData.numeroNota,
        title: formData.title,
        store: formData.store,
        purchaseDate: formatDate(formData.purchaseDate),
        dueDate: formatDate(formData.dueDate),
        typeNote: formData.typeNote,
        createdBy: createdBy, // Atualiza com o usuário atual que está editando
        value: formData.value ? parseFloat(formData.value.replace(/\./g, "").replace(",", ".")) : 0,
        status: calculateStatus(formatDate(formData.dueDate)),
        phone: formData.phone || undefined,
        observations: formData.observations || undefined,
      };

      // Atualizar no array de notas salvas
      const noteIndex = savedNotas.findIndex((n: Nota) => n.id === noteToEdit.id);
      if (noteIndex !== -1) {
        savedNotas[noteIndex] = updatedNote;
      } else {
        // Se não estiver nas salvas, pode estar nas notas padrão (não editável)
        // Nesse caso, adiciona nas salvas
        savedNotas.push(updatedNote);
      }
      localStorage.setItem("notas", JSON.stringify(savedNotas));
    } else {
      // Modo de criação - criar nova nota
      const maxId = allNotas.length > 0
        ? Math.max(...allNotas.map((n: Nota) => n.id))
        : 0;

      updatedNote = {
        id: maxId + 1,
        numeroNota: formData.numeroNota,
        title: formData.title,
        store: formData.store,
        purchaseDate: formatDate(formData.purchaseDate),
        dueDate: formatDate(formData.dueDate),
        typeNote: formData.typeNote,
        createdBy: createdBy,
        value: formData.value ? parseFloat(formData.value.replace(/\./g, "").replace(",", ".")) : 0,
        status: calculateStatus(formatDate(formData.dueDate)),
        createdAt: getCurrentDateFormatted(),
        phone: formData.phone || undefined,
        observations: formData.observations || undefined,
      };

      savedNotas.push(updatedNote);
      localStorage.setItem("notas", JSON.stringify(savedNotas));
    }

    // Gerenciar PDFs principais
    const pdfs = JSON.parse(localStorage.getItem("notaPdfs") || "{}");
    const extendedWarrantyPdfs = JSON.parse(localStorage.getItem("extendedWarrantyPdfs") || "{}");
    const assistanceWarrantyPdfs = JSON.parse(localStorage.getItem("assistanceWarrantyPdfs") || "{}");
    const extendedWarrantyDates = JSON.parse(localStorage.getItem("extendedWarrantyDates") || "{}");
    const assistanceWarrantyDates = JSON.parse(localStorage.getItem("assistanceWarrantyDates") || "{}");

    // Salvar datas adicionais
    if (formData.typeNote === "Garantia Estendida" && formData.extendedWarrantyDate) {
      extendedWarrantyDates[updatedNote.id] = formatDate(formData.extendedWarrantyDate);
      localStorage.setItem("extendedWarrantyDates", JSON.stringify(extendedWarrantyDates));
    }

    if (formData.typeNote === "Garantia de Assistência" && formData.assistanceWarrantyDate) {
      assistanceWarrantyDates[updatedNote.id] = formatDate(formData.assistanceWarrantyDate);
      localStorage.setItem("assistanceWarrantyDates", JSON.stringify(assistanceWarrantyDates));
    }

    // Função para processar todos os PDFs
    const processPdfs = () => {
      let pdfsToProcess = 0;
      let pdfsProcessed = 0;

      // Contar PDFs a processar (apenas os que precisam de conversão assíncrona)
      const hasNewNotaPdfs = pdfFileList.some((x) => x.file);
      const hasNewExtendedWarrantyPdfs = extendedWarrantyFileList.some((x) => x.file);
      if (hasNewNotaPdfs) pdfsToProcess++;
      if (hasNewExtendedWarrantyPdfs) pdfsToProcess++;
      if (assistanceWarrantyPdf) pdfsToProcess++;

      // Persistir lista de notas fiscais (apenas .data, sem conversão)
      const saveNotaPdfList = () => {
        const mainResult = pdfFileList
          .filter((x): x is PdfListItem & { data: string } => !!x.data)
          .map((x) => ({ fileName: x.fileName, data: x.data }));
        if (mainResult.length) pdfs[updatedNote.id] = mainResult;
        else delete pdfs[updatedNote.id];
        localStorage.setItem("notaPdfs", JSON.stringify(pdfs));
      };

      // Persistir lista de garantia estendida (apenas .data)
      const saveExtendedWarrantyList = () => {
        const extendedResult = extendedWarrantyFileList
          .filter((x): x is PdfListItem & { data: string } => !!x.data)
          .map((x) => ({ fileName: x.fileName, data: x.data }));
        if (extendedResult.length) extendedWarrantyPdfs[updatedNote.id] = extendedResult;
        else delete extendedWarrantyPdfs[updatedNote.id];
        localStorage.setItem("extendedWarrantyPdfs", JSON.stringify(extendedWarrantyPdfs));
      };

      // Se não há PDFs para processar (async), salvar o que temos e redirecionar
      if (pdfsToProcess === 0) {
        saveNotaPdfList();
        saveExtendedWarrantyList();
        if (isEditMode && noteToEdit) {
          if (!assistanceWarrantyPdf && assistanceWarrantyPdfs[noteToEdit.id]) {
            delete assistanceWarrantyPdfs[noteToEdit.id];
            localStorage.setItem("assistanceWarrantyPdfs", JSON.stringify(assistanceWarrantyPdfs));
          }
        }
        
        // Mostrar toast de sucesso
        showToast(isEditMode ? "Nota atualizada com sucesso!" : "Nota cadastrada com sucesso!", "success");
        
        // Disparar evento customizado para atualizar a Home
        window.dispatchEvent(new Event("notesUpdated"));
        
        // Redirecionar para home após um breve delay
        setTimeout(() => {
          navigate("/home");
        }, 500);
        
        return;
      }

      // Se há PDFs para processar, usar callback para quando todos terminarem
      const checkAllPdfsProcessed = () => {
        pdfsProcessed++;
        if (pdfsProcessed === pdfsToProcess) {
          // Mostrar toast de sucesso
          showToast(isEditMode ? "Nota atualizada com sucesso!" : "Nota cadastrada com sucesso!", "success");
          
          // Disparar evento customizado para atualizar a Home
          window.dispatchEvent(new Event("notesUpdated"));
          
          // Redirecionar para home após um breve delay
          setTimeout(() => {
            navigate("/home");
          }, 500);
        }
      };

      // Processar PDFs da nota fiscal (múltiplos)
      if (hasNewNotaPdfs) {
        const newItems = pdfFileList.filter((x): x is PdfListItem & { file: File } => !!x.file);
        const existingItems = pdfFileList
          .filter((x): x is PdfListItem & { data: string } => !!x.data)
          .map((x) => ({ fileName: x.fileName, data: x.data }));

        const convertFile = (item: { file: File; fileName: string }) =>
          new Promise<{ fileName: string; data: string }>((resolve, reject) => {
            const r = new FileReader();
            r.onloadend = () => resolve({ fileName: item.fileName, data: r.result as string });
            r.onerror = () => reject(new Error("Erro ao processar " + item.fileName));
            r.readAsDataURL(item.file);
          });

        Promise.all(newItems.map(convertFile))
          .then((converted) => {
            const merged = [...existingItems, ...converted];
            if (merged.length) pdfs[updatedNote.id] = merged;
            else delete pdfs[updatedNote.id];
            localStorage.setItem("notaPdfs", JSON.stringify(pdfs));
          })
          .catch(() => {
            showToast("Erro ao processar um ou mais arquivos da nota fiscal", "error");
          })
          .finally(checkAllPdfsProcessed);
      }

      // Processar PDFs da garantia estendida (múltiplos)
      if (hasNewExtendedWarrantyPdfs) {
        const newItems = extendedWarrantyFileList.filter((x): x is PdfListItem & { file: File } => !!x.file);
        const existingItems = extendedWarrantyFileList
          .filter((x): x is PdfListItem & { data: string } => !!x.data)
          .map((x) => ({ fileName: x.fileName, data: x.data }));

        const convertFile = (item: { file: File; fileName: string }) =>
          new Promise<{ fileName: string; data: string }>((resolve, reject) => {
            const r = new FileReader();
            r.onloadend = () => resolve({ fileName: item.fileName, data: r.result as string });
            r.onerror = () => reject(new Error("Erro ao processar " + item.fileName));
            r.readAsDataURL(item.file);
          });

        Promise.all(newItems.map(convertFile))
          .then((converted) => {
            const merged = [...existingItems, ...converted];
            if (merged.length) extendedWarrantyPdfs[updatedNote.id] = merged;
            else delete extendedWarrantyPdfs[updatedNote.id];
            localStorage.setItem("extendedWarrantyPdfs", JSON.stringify(extendedWarrantyPdfs));
          })
          .catch(() => {
            showToast("Erro ao processar um ou mais arquivos da garantia estendida", "error");
          })
          .finally(checkAllPdfsProcessed);
      }

      // Processar PDF garantia de assistência
      if (assistanceWarrantyPdf) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          assistanceWarrantyPdfs[updatedNote.id] = {
            fileName: assistanceWarrantyPdfName,
            data: base64String,
          };
          localStorage.setItem("assistanceWarrantyPdfs", JSON.stringify(assistanceWarrantyPdfs));
          checkAllPdfsProcessed();
        };
        reader.onerror = () => {
          showToast("Erro ao processar o PDF da garantia de assistência", "error");
          checkAllPdfsProcessed(); // Contar mesmo em caso de erro para não travar
        };
        reader.readAsDataURL(assistanceWarrantyPdf);
      }
    };

    // Executar processamento de PDFs
    processPdfs();
  };

  const handleGoBack = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Título e Botão de Voltar - Alinhados Horizontalmente */}
        <div className="relative flex items-center justify-center mb-6">
          {/* Botão de Voltar - Apenas Mobile */}
          <button
            onClick={handleGoBack}
            className="md:hidden absolute left-0 flex items-center gap-2 text-[#724EBF] hover:text-[#5a3a9f] transition"
          >
            <CircleArrowLeft className="w-6 h-6" />
            <span className="font-medium">Voltar</span>
          </button>

          <h1 className="text-2xl font-bold text-[#724EBF]">
            {isEditMode ? "Editar Nota" : "Cadastrar Novo Produto"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          {/* Upload de Notas Fiscais (PDF ou Imagem) - múltiplos */}
          <div>
            <label className="block text-left text-sm font-medium text-gray-700 mb-2">
              Upload de Notas Fiscais (PDF ou Imagem)
            </label>
            <p className="text-xs text-gray-500 mb-2">Você pode anexar mais de uma nota fiscal.</p>
            {pdfFileList.length > 0 && (
              <div className="space-y-2 mb-2">
                {pdfFileList.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 shrink-0 ${getFileTypeInfo(item.fileName, item.file).bgColor} rounded flex items-center justify-center`}>
                        <span className={`${getFileTypeInfo(item.fileName, item.file).textColor} font-bold text-sm`}>
                          {getFileTypeInfo(item.fileName, item.file).label}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{item.fileName}</p>
                        {item.file && (
                          <p className="text-xs text-gray-500">
                            {(item.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        )}
                        {item.data && !item.file && (
                          <p className="text-xs text-gray-500">Arquivo existente</p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePdfFromList(idx)}
                      className="p-2 shrink-0 text-gray-400 hover:text-red-600 transition"
                      aria-label={`Remover ${item.fileName}`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
              <div className="flex flex-col items-center justify-center py-3">
                <Upload className="w-8 h-8 mb-1 text-gray-400" />
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">{pdfFileList.length ? "Adicionar mais" : "Clique para fazer upload"}</span>
                  {pdfFileList.length ? "" : " ou arraste os arquivos"}
                </p>
                <p className="text-xs text-gray-500">PDF ou Imagens (MAX. 10MB) • múltiplos permitidos</p>
              </div>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,application/pdf,image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                aria-label="Anexar notas fiscais"
              />
            </label>
          </div>

          {/* Número da Nota */}
          <div>
            <label className="block text-left text-sm font-medium text-gray-700 mb-2">
              Número da Nota <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="numeroNota"
              value={formData.numeroNota}
              onChange={handleInputChange}
              placeholder="Ex: 12345"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#724EBF] focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Nome do Produto */}
          <div>
            <label className="block text-left text-sm font-medium text-gray-700 mb-2">
              Nome do Produto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ex: Notebook Gamer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#724EBF] focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Loja */}
          <div>
            <label className="block text-left text-sm font-medium text-gray-700 mb-2">
              Loja <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="store"
              value={formData.store}
              onChange={handleInputChange}
              placeholder="Ex: Magazine Luiza"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#724EBF] focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Data de Compra */}
          <div>
            <label htmlFor="purchaseDate" className="block text-left text-sm font-medium text-gray-700 mb-2">
              Data de Compra <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="purchaseDate"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#724EBF] focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Fim da Garantia */}
          <div>
            <label htmlFor="dueDate" className="block text-left text-sm font-medium text-gray-700 mb-2">
              Fim da Garantia <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#724EBF] focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Telefone da Loja */}
          <div>
            <label className="block text-left text-sm font-medium text-gray-700 mb-2">
              Telefone da Loja
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Ex: (11) 99999-9999"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#724EBF] focus:border-transparent outline-none"
            />
          </div>

          {/* Tipo de Garantia */}
          <div>
            <label htmlFor="typeNote" className="block text-left text-sm font-medium text-gray-700 mb-2">
              Tipo de Garantia <span className="text-red-500">*</span>
            </label>
            <select
              id="typeNote"
              name="typeNote"
              value={formData.typeNote}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#724EBF] focus:border-transparent outline-none"
              required
            >
              <option value="">Selecione o tipo de garantia</option>
              <option value="Garantia Legal">Garantia Legal</option>
              <option value="Garantia Estendida">Garantia Estendida</option>
            </select>
            
            {/* Descrição para Garantia Legal */}
            {formData.typeNote === "Garantia Legal" && (
              <p className="mt-2 text-sm text-gray-600 italic">
                Garantias legais para bens não duráveis são de 90 dias (3 meses) a partir da entrega.
              </p>
            )}
          </div>

          {/* Campos condicionais para Garantia Estendida */}
          {formData.typeNote === "Garantia Estendida" && (
            <>
              {/* Data do fim da garantia estendida */}
              <div>
                <label htmlFor="extendedWarrantyDate" className="block text-left text-sm font-medium text-gray-700 mb-2">
                  Data do fim da garantia estendida <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="extendedWarrantyDate"
                  name="extendedWarrantyDate"
                  value={formData.extendedWarrantyDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#724EBF] focus:border-transparent outline-none"
                  required
                />
              </div>

              {/* Upload PDF/Imagem Garantia Estendida - múltiplos */}
              <div>
                <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                  Upload de Garantia Estendida (PDF ou Imagem)
                </label>
                <p className="text-xs text-gray-500 mb-2">Você pode anexar mais de um arquivo de garantia estendida.</p>
                {extendedWarrantyFileList.length > 0 && (
                  <div className="space-y-2 mb-2">
                    {extendedWarrantyFileList.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 shrink-0 ${getFileTypeInfo(item.fileName, item.file).bgColor} rounded flex items-center justify-center`}>
                            <span className={`${getFileTypeInfo(item.fileName, item.file).textColor} font-bold text-sm`}>
                              {getFileTypeInfo(item.fileName, item.file).label}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">{item.fileName}</p>
                            {item.file && (
                              <p className="text-xs text-gray-500">
                                {(item.file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            )}
                            {item.data && !item.file && (
                              <p className="text-xs text-gray-500">Arquivo existente</p>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExtendedWarrantyFromList(idx)}
                          className="p-2 shrink-0 text-gray-400 hover:text-red-600 transition"
                          aria-label={`Remover ${item.fileName}`}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                  <div className="flex flex-col items-center justify-center py-3">
                    <Upload className="w-8 h-8 mb-1 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">{extendedWarrantyFileList.length ? "Adicionar mais" : "Clique para fazer upload"}</span>
                      {extendedWarrantyFileList.length ? "" : " ou arraste os arquivos"}
                    </p>
                    <p className="text-xs text-gray-500">PDF ou Imagens (MAX. 10MB) • múltiplos permitidos</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,application/pdf,image/*"
                    multiple
                    onChange={handleExtendedWarrantyFileChange}
                    className="hidden"
                    aria-label="Anexar garantias estendidas"
                  />
                </label>
              </div>
            </>
          )}

          {/* Valor */}
          <div>
            <label className="block text-left text-sm font-medium text-gray-700 mb-2">
              Valor (R$) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="value"
              value={formData.value}
              onChange={handleInputChange}
              placeholder="Ex: 1.000,00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#724EBF] focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Observações */}
          <div>
            <label className="block text-left text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              name="observations"
              value={formData.observations}
              onChange={handleInputChange}
              rows={4}
              placeholder="Adicione observações sobre a nota..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#724EBF] focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Botão de Salvar */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 bg-[#724EBF] text-white font-semibold rounded-lg hover:bg-[#5a3a9f] transition-colors shadow-md"
            >
              {isEditMode ? "Salvar Alterações" : "Cadastrar Novo Produto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrationNote;
