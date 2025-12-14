import Header from "../components/Header.tsx";
import SearchBar from "../components/SearchBar.tsx";
import SummaryCard from "../components/SummaryCard.tsx";
import NoteItem from "../components/NoteItem.tsx";
import FloatingButton from "../components/FloatingButton.tsx";

const Home = () => {
  const resumo = [
    { title: "Total", value: 12, icon: "📄", status: "total" },
    { title: "Vencendo", value: 3, icon: "⏰", status: "vencendo" },
    { title: "Ativas", value: 12, icon: "✅", status: "ativas" },
    { title: "Vencidas", value: 3, icon: "⚠️", status: "vencidas" },
  ];

  const notas = [
    {
      id: 1,
      titulo: "Monitor Dell",
      fornecedor: "Magazine Luiza",
      compraData: "12/02/2025",
      tipoNota: "Garantia Normal",
      valor: 1000,
      status: "Em garantia",
    },
    {
      id: 2,
      titulo: "Teclado Dell",
      fornecedor: "Magazine Luiza",
      compraData: "12/02/2025",
      tipoNota: "Garantia Estendida",
      valor: 1000,
      status: "Vencida",
    },
     {
      id: 1,
      titulo: "Monitor Dell",
      fornecedor: "Magazine Luiza",
      compraData: "12/02/2025",
      tipoNota: "Garantia Normal",
      valor: 1000,
      status: "Em garantia",
    },
    {
      id: 2,
      titulo: "Teclado Dell",
      fornecedor: "Magazine Luiza",
      compraData: "12/02/2025",
      tipoNota: "Garantia Estendida",
      valor: 1000,
      status: "Vencida",
    },
     {
      id: 1,
      titulo: "Monitor Dell",
      fornecedor: "Magazine Luiza",
      compraData: "12/02/2025",
      tipoNota: "Garantia Normal",
      valor: 1000,
      status: "Em garantia",
    },
    {
      id: 2,
      titulo: "Teclado Dell",
      fornecedor: "Magazine Luiza",
      compraData: "12/02/2025",
      tipoNota: "Garantia Estendida",
      valor: 1000,
      status: "Vencida",
    },
  ];

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
