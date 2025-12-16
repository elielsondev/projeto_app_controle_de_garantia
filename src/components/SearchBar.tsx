import filtroIcon from "../assets/filtro.png";
import lupaIcon from "../assets/lupa.png";

const SearchBar = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="flex items-center bg-gray-50 rounded-xl shadow gap-3 w-[900px] h-9 m-5 p-5">
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
            className="w-5 h-5 object-contain bg-current"
          />
        </button>

        <button
          className="p-2 rounded-lg hover:bg-gray-100 transition"
          aria-label="Filtrar"
        >
          <img
            src={filtroIcon}
            alt="Filtrar"
            className="w-5 h-5 object-contain bg-current"
          />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;

