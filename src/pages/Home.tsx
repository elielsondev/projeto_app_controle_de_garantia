import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.tsx";
import SearchBar from "../components/SearchBar.tsx";
import SummaryCard from "../components/SummaryCard.tsx";
import NoteItem from "../components/NoteItem.tsx";
import FloatingButton from "../components/FloatingButton.tsx";
import { resumo, notas, type ResumoItem, type Nota } from "../data";

const Home = () => {
  const navigate = useNavigate();

  // Verificar se o usuário está logado ao carregar a página
  useEffect(() => {
    const isLoggedInLocal = localStorage.getItem("isLoggedIn");
    const isLoggedInSession = sessionStorage.getItem("isLoggedIn");
    
    // Verifica tanto localStorage (persistente) quanto sessionStorage (sessão atual)
    if (isLoggedInLocal !== "true" && isLoggedInSession !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <SearchBar />

      <div className="w-full px-5 sm:px-15 mt-1 mb-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-7 max-w-full">
          {resumo.map((item: ResumoItem, index: number) => (
            <SummaryCard key={index} {...item} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 px-9">
        {notas.map((note: Nota) => (
          <NoteItem key={note.id} note={note} />
        ))}
      </div>

      <FloatingButton />
    </div>
  );
};

export default Home;
