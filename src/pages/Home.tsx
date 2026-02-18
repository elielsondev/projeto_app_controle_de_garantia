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

  // Função para carregar notas (exclui as que estão na lixeira)
  const loadNotas = () => {
    const savedNotas = JSON.parse(localStorage.getItem("notas") || "[]");
    const deletedNotes = JSON.parse(localStorage.getItem("deletedNotes") || "[]");
    const trashNotes = JSON.parse(localStorage.getItem("trashNotes") || "[]");
    const trashIds = new Set(trashNotes.map((n: Nota) => n.id));
    const activeFixedNotas = notas.filter((n: Nota) => !deletedNotes.includes(n.id));
    const merged = [...activeFixedNotas, ...savedNotas];
    const notInTrash = merged.filter((n: Nota) => !trashIds.has(n.id));
    setAllNotas(notInTrash);
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
      if (activeFilter === "active" && note.status !== "Ativa") return false;
      if (activeFilter === "expired" && note.status !== "Vencida") return false;
      if (activeFilter === "expiring" && note.status !== "Vencendo") return false;

      // Filtro por status do modal
      if (filterState.status.length > 0 && !filterState.status.includes(note.status)) {
        return false;
      }

      // Filtro por tipo de garantia
      if (filterState.typeNote.length > 0 && !filterState.typeNote.includes(note.typeNote)) {
        return false;
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
    note => note.status === "Ativa"
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
    { title: "Ativas", value: activeCount, status: "active" },
    { title: "Vencidas", value: expiredCount, status: "expired" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <SearchBar onFilterChange={setFilterState} onSearchChange={setSearchTerm} />

      <div className="w-full px-5 sm:px-15 mt-1 mb-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-7">
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 px-9">
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