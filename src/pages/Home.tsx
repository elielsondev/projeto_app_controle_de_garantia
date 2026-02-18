import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.tsx";
import SearchBar from "../components/SearchBar.tsx";
import SummaryCard from "../components/SummaryCard.tsx";
import NoteItem from "../components/NoteItem.tsx";
import FloatingButton from "../components/FloatingButton.tsx";
import { notas, type ResumoItem, type Nota } from "../data";
import { type FilterState } from "../components/FilterModal";

type FilterStatus = ResumoItem["status"];

const Home = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("total");
  const [filterState, setFilterState] = useState<FilterState>({
    status: [],
    typeNote: [],
    sortBy: "",
    sortOrder: "asc",
  });
  const [allNotas, setAllNotas] = useState<Nota[]>(notas);
  const [searchTerm, setSearchTerm] = useState("");

  // Função para calcular status considerando todas as datas de garantia
  const calculateStatusWithAllWarranties = (
    dueDate: string,
    warrantyTypes: string[],
    extendedWarrantyDate?: string,
    assistanceWarrantyDate?: string
  ): "Em Garantia" | "Vencida" | "Vencendo" => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Função para converter data DD/MM/YYYY para Date
    const parseDateToDate = (dateStr: string): Date => {
      const [day, month, year] = dateStr.split("/").map(Number);
      return new Date(year, month - 1, day);
    };

    // Array para armazenar todas as datas de garantia
    const warrantyDates: Date[] = [];

    // Sempre adicionar a data principal (fim da garantia)
    warrantyDates.push(parseDateToDate(dueDate));

    // Se tiver Garantia Estendida e data preenchida, adicionar
    if (warrantyTypes.includes("Garantia Estendida") && extendedWarrantyDate) {
      warrantyDates.push(parseDateToDate(extendedWarrantyDate));
    }

    // Se tiver Garantia de Assistência e data preenchida, adicionar
    if (warrantyTypes.includes("Garantia de Assistência") && assistanceWarrantyDate) {
      warrantyDates.push(parseDateToDate(assistanceWarrantyDate));
    }

    // Encontrar a data mais distante no futuro (mais recente)
    const furthestDate = warrantyDates.reduce((latest, current) => {
      return current > latest ? current : latest;
    });

    // Calcular dias até a data mais distante
    const daysUntilDue = Math.ceil((furthestDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) return "Vencida";
    if (daysUntilDue <= 30) return "Vencendo";
    return "Em Garantia";
  };

  // Função para carregar notas (exclui as que estão na lixeira) e recalcular status
  const loadNotas = () => {
    const savedNotas = JSON.parse(localStorage.getItem("notas") || "[]");
    const deletedNotes = JSON.parse(localStorage.getItem("deletedNotes") || "[]");
    const trashNotes = JSON.parse(localStorage.getItem("trashNotes") || "[]");
    const trashIds = new Set(trashNotes.map((n: Nota) => n.id));
    const activeFixedNotas = notas.filter((n: Nota) => !deletedNotes.includes(n.id));
    const merged = [...activeFixedNotas, ...savedNotas];
    const notInTrash = merged.filter((n: Nota) => !trashIds.has(n.id));

    // Carregar datas adicionais de garantias
    const extendedWarrantyDates = JSON.parse(localStorage.getItem("extendedWarrantyDates") || "{}");
    const assistanceWarrantyDates = JSON.parse(localStorage.getItem("assistanceWarrantyDates") || "{}");

    // Recalcular status para cada nota considerando todas as garantias
    const notasWithUpdatedStatus = notInTrash.map((note: Nota) => {
      const warrantyTypes = note.typeNote ? note.typeNote.split(",").map(t => t.trim()) : [];
      const extendedDate = extendedWarrantyDates[note.id];
      const assistanceDate = assistanceWarrantyDates[note.id];

      const newStatus = calculateStatusWithAllWarranties(
        note.dueDate,
        warrantyTypes,
        extendedDate,
        assistanceDate
      );

      return {
        ...note,
        status: newStatus,
      };
    });

    // Atualizar notas no localStorage com status recalculado
    const updatedSavedNotas = savedNotas.map((note: Nota) => {
      const warrantyTypes = note.typeNote ? note.typeNote.split(",").map(t => t.trim()) : [];
      const extendedDate = extendedWarrantyDates[note.id];
      const assistanceDate = assistanceWarrantyDates[note.id];

      const newStatus = calculateStatusWithAllWarranties(
        note.dueDate,
        warrantyTypes,
        extendedDate,
        assistanceDate
      );

      return {
        ...note,
        status: newStatus,
      };
    });

    localStorage.setItem("notas", JSON.stringify(updatedSavedNotas));
    setAllNotas(notasWithUpdatedStatus);
  };

  useEffect(() => {
    const isLoggedInLocal = localStorage.getItem("isLoggedIn");
    const isLoggedInSession = sessionStorage.getItem("isLoggedIn");

    if (isLoggedInLocal !== "true" && isLoggedInSession !== "true") {
      navigate("/login");
      return;
    }

    // Carregar notas inicialmente
    loadNotas();

    // Listener para atualizar quando a página recebe foco (volta de outra página)
    const handleFocus = () => {
      loadNotas();
    };

    // Listener para mudanças no localStorage (de outras abas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "notas" || e.key === "deletedNotes" || e.key === "trashNotes") {
        loadNotas();
      }
    };

    // Listener customizado para eventos de restauração/deleção
    const handleCustomEvent = () => {
      loadNotas();
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("notesUpdated", handleCustomEvent);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("notesUpdated", handleCustomEvent);
    };
  }, [navigate]);

  // Função para converter data DD/MM/YYYY para Date
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const filteredAndSortedNotas = useMemo(() => {
    let filtered = allNotas.filter((note: Nota) => {
      // Filtro de busca por nome ou número da nota
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase().trim();
        const titleMatch = note.title.toLowerCase().includes(searchLower);
        const numeroMatch = note.numeroNota.toLowerCase().includes(searchLower);
        
        if (!titleMatch && !numeroMatch) {
          return false;
        }
      }

      // Filtro por status do card (mantém compatibilidade)
      if (activeFilter === "active" && note.status !== "Em Garantia") return false;
      if (activeFilter === "expired" && note.status !== "Vencida") return false;
      if (activeFilter === "expiring" && note.status !== "Vencendo") return false;

      // Filtro por status do modal
      if (filterState.status.length > 0 && !filterState.status.includes(note.status)) {
        return false;
      }

      // Filtro por tipo de garantia (suporta múltiplas garantias separadas por vírgula)
      if (filterState.typeNote.length > 0) {
        const noteWarrantyTypes = note.typeNote ? note.typeNote.split(",").map(t => t.trim()) : [];
        const hasMatchingWarranty = filterState.typeNote.some(selectedType => {
          const trimmedSelectedType = selectedType.trim();
          return noteWarrantyTypes.some(noteType => noteType.trim() === trimmedSelectedType);
        });
        if (!hasMatchingWarranty) {
          return false;
        }
      }

      // Filtro por título
      if (filterState.title && !note.title.toLowerCase().includes(filterState.title.toLowerCase())) {
        return false;
      }

      return true;
    });

    // Ordenação
    if (filterState.sortBy) {
      filtered = [...filtered].sort((a, b) => {
        let comparison = 0;

        switch (filterState.sortBy) {
          case "createdDate":
            comparison = parseDate(a.createdAt).getTime() - parseDate(b.createdAt).getTime();
            break;
          case "purchaseDate":
            comparison = parseDate(a.purchaseDate).getTime() - parseDate(b.purchaseDate).getTime();
            break;
          case "value":
            comparison = a.value - b.value;
            break;
        }

        return filterState.sortOrder === "asc" ? comparison : -comparison;
      });
    }

    return filtered;
  }, [allNotas, activeFilter, filterState, searchTerm]);

  const totalCount = allNotas.length;

  const activeCount = allNotas.filter(
    note => note.status === "Em Garantia"
  ).length;

  const expiredCount = allNotas.filter(
    note => note.status === "Vencida"
  ).length;

  const expiringCount = allNotas.filter(
    note => note.status === "Vencendo"
  ).length;

  const summaryData: ResumoItem[] = [
    { title: "Total", value: totalCount, status: "total" },
    { title: "Vencendo", value: expiringCount, status: "expiring" },
    { title: "Em Garantia", value: activeCount, status: "active" },
    { title: "Vencidas", value: expiredCount, status: "expired" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <SearchBar onFilterChange={setFilterState} onSearchChange={setSearchTerm} />

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 mt-1 mb-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-7">
          {summaryData.map((item: ResumoItem, index) => (
            <SummaryCard
              key={index}
              {...item}
              isActive={activeFilter === item.status}
              onClick={() => setActiveFilter(item.status)}
            />
          ))}
        </div>
      </div>

      {filteredAndSortedNotas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Nenhum produto encontrado
          </h2>
          <p className="text-gray-500 text-center max-w-md">
            {allNotas.length === 0
              ? "Você ainda não possui produtos cadastrados. Clique no botão + para cadastrar um!"
              : "Nenhuma nota corresponde aos filtros aplicados. Tente ajustar os filtros ou limpar a busca."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 sm:px-6 md:px-8 lg:px-9">
          {filteredAndSortedNotas.map((note) => (
            <NoteItem key={note.id} note={note} />
          ))}
        </div>
      )}

      <FloatingButton />
    </div>
  );
};

export default Home;