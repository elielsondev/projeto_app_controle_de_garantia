import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import FilterModal, { type FilterState } from "./FilterModal";

interface SearchBarProps {
  filterState: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const SearchBar = ({ filterState, onFilterChange }: SearchBarProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchText, setSearchText] = useState(filterState.title || "");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);

    onFilterChange({
      ...filterState,
      title: value,
    });
  };

  const handleFilterApply = (filters: FilterState) => {
    onFilterChange({
      ...filters,
      title: searchText,
    });
    setIsFilterOpen(false);
  };

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="flex items-center bg-gray-50 rounded-xl shadow w-full gap-3 h-9 m-5 p-6">
          <Search className="w-6 h-6 text-gray-600" />

          <input
            type="text"
            placeholder="Pesquisar por nome do produto"
            value={searchText}
            onChange={handleSearchChange}
            className="flex-1 outline-none text-sm bg-transparent"
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

