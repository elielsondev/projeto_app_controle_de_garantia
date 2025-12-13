import filtroIcon from "../assets/filtro.png";
import lupaIcon from "../assets/lupa.png";

const SearchBar = () => {
  return (
    <div className="bg-purple-800 px-5 pb-4">
      <div className="flex items-center bg-white rounded-xl px-4 py-2 shadow gap-2">
        <input
          type="text"
          placeholder="Pesquisar Notas"
          className="flex-1 outline-none text-sm"
        />

        <button
          className="p-2 rounded-lg hover:bg-gray-100 transition"
          aria-label="busca"
        >
          <img
            src={lupaIcon}
            alt="busca"
            className="w-5 h-5 object-contain"
          />
        </button>

        <button
          className="p-2 rounded-lg hover:bg-gray-100 transition"
          aria-label="Filtrar"
        >
          <img
            src={filtroIcon}
            alt="Filtrar"
            className="w-5 h-5 object-contain"
          />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;

