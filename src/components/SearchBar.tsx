import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import FilterModal, { type FilterState } from "./FilterModal";

interface SearchBarProps {
  onFilterChange?: (filters: FilterState) => void;
}

const SearchBar = ({ onFilterChange }: SearchBarProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterApply = (filters: FilterState) => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
    setIsFilterOpen(false);
  };

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="flex items-center bg-gray-50 rounded-xl shadow w-full gap-3 h-9 m-5 p-6">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition bg-transparent"
            aria-label="busca"
          >
            <Search className="w-6 h-6 text-gray-600" />
          </button>

          <input
            type="text"
            placeholder="Pesquisar Notas"
            className="flex-1 outline-none text-sm"
          />

          <button
            onClick={() => setIsFilterOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition bg-transparent"
            aria-label="Filtrar"
          >
            <SlidersHorizontal className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleFilterApply}
      />
    </>
  );
};

export default SearchBar;

