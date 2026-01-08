import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.tsx";
import SearchBar from "../components/SearchBar.tsx";
import SummaryCard from "../components/SummaryCard.tsx";
import NoteItem from "../components/NoteItem.tsx";
import FloatingButton from "../components/FloatingButton.tsx";
import { notas, type ResumoItem, type Nota } from "../data";

type FilterStatus = ResumoItem["status"];

const Home = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("total");

  useEffect(() => {
    const isLoggedInLocal = localStorage.getItem("isLoggedIn");
    const isLoggedInSession = sessionStorage.getItem("isLoggedIn");

    if (isLoggedInLocal !== "true" && isLoggedInSession !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  const filteredNotas = notas.filter((note: Nota) => {
    if (activeFilter === "total") return true;
    if (activeFilter === "active") return note.status === "Ativa";
    if (activeFilter === "expired") return note.status === "Vencida";
    if (activeFilter === "expiring") {
      // por enquanto usando texto, depois pode virar cálculo por data
      return note.status === "Vencendo";
    }
    return true;
  });

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
      <SearchBar />

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
        {filteredNotas.map((note) => (
          <NoteItem key={note.id} note={note} />
        ))}
      </div>

      <FloatingButton />
    </div>
  );
};

export default Home;