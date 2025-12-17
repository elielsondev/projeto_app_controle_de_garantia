import filterIcon from "../assets/filterIcon.png";
import searchIcon from "../assets/searchIcon.png";

const SearchBar = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="flex items-center bg-gray-50 rounded-xl shadow w-full gap-3 h-9 m-5 p-6">
        <button
          className="p-2 rounded-lg hover:bg-gray-100 transition bg-transparent"
          aria-label="busca"
        >
          <img
            src={searchIcon}
            alt="busca"
            className="w-6 h-6 object-contain"
          />
        </button>

        <input
          type="text"
          placeholder="Pesquisar Notas"
          className="flex-1 outline-none text-sm"
        />

        <button
          className="p-2 rounded-lg hover:bg-gray-100 transition bg-transparent"
          aria-label="Filtrar"
        >
          <img
            src={filterIcon}
            alt="Filtrar"
            className="w-6 h-6 object-contain"
          />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;

