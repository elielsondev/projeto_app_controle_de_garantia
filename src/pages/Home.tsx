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

  useEffect(() => {
    const isLoggedInLocal = localStorage.getItem("isLoggedIn");
    const isLoggedInSession = sessionStorage.getItem("isLoggedIn");

    if (isLoggedInLocal !== "true" && isLoggedInSession !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  // Função para converter data DD/MM/YYYY para Date
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const filteredAndSortedNotas = useMemo(() => {
    let filtered = notas.filter((note: Nota) => {
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
  }, [notas, activeFilter, filterState]);

  const totalCount = notas.length;

  const activeCount = notas.filter(
    note => note.status === "Ativa"
  ).length;

  const expiredCount = notas.filter(
    note => note.status === "Vencida"
  ).length;

  const expiringCount = notas.filter(
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
      <SearchBar onFilterChange={setFilterState} />

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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 px-9">
        {filteredAndSortedNotas.map((note) => (
          <NoteItem key={note.id} note={note} />
        ))}
      </div>

      <FloatingButton />
    </div>
  );
};

export default Home;