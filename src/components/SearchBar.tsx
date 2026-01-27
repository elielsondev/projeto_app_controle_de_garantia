import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import FilterModal, { type FilterState } from "./FilterModal";

interface SearchBarProps {
  onFilterChange?: (filters: FilterState) => void;
  onSearchChange?: (searchTerm: string) => void;
}

const SearchBar = ({ onFilterChange, onSearchChange }: SearchBarProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

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
          <Search className="w-6 h-6 text-gray-600" />

          <input
            type="text"
            placeholder="Pesquisar por nome ou número da nota"
            className="flex-1 outline-none text-sm bg-transparent"
            value={searchTerm}
            onChange={handleSearchChange}
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

