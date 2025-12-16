import Header from "../components/Header.tsx";
import SearchBar from "../components/SearchBar.tsx";
import SummaryCard from "../components/SummaryCard.tsx";
import NoteItem from "../components/NoteItem.tsx";
import FloatingButton from "../components/FloatingButton.tsx";
import { resumo, notas } from "../data";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <Header />
      <SearchBar />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-5 py-4">
        {resumo.map((item, index) => (
          <SummaryCard key={index} {...item} />
        ))}
      </div>

      <div className="px-5">
        {notas.map((note) => (
          <NoteItem key={note.id} note={note} />
        ))}
      </div>

      <FloatingButton />
    </div>
  );
};

export default Home;
