import { useState } from "react";

interface FilterModalProps {
     isOpen: boolean;
     onClose: () => void;
     onApplyFilters: (filters: FilterState) => void;
}

export interface FilterState {
     status: string[];
     typeNote: string[];
     sortBy: "createdDate" | "purchaseDate" | "value" | "";
     sortOrder: "asc" | "desc";
     title?: string;
}

const FilterModal = ({ isOpen, onClose, onApplyFilters }: FilterModalProps) => {
     const [filters, setFilters] = useState<FilterState>({
          status: [],
          typeNote: [],
          sortBy: "",
          sortOrder: "asc",
     });

     const statusOptions = ["Em Garantia", "Vencida", "Vencendo"];
     const typeNoteOptions = ["Garantia Legal", "Garantia Estendida", "Garantia de Assistência"];

     const handleStatusToggle = (status: string) => {
          setFilters((prev) => ({
               ...prev,
               status: prev.status.includes(status)
                    ? prev.status.filter((s) => s !== status)
                    : [...prev.status, status],
          }));
     };

     const handleTypeToggle = (type: string) => {
          setFilters((prev) => ({
               ...prev,
               typeNote: prev.typeNote.includes(type)
                    ? prev.typeNote.filter((t) => t !== type)
                    : [...prev.typeNote, type],
          }));
     };

     const handleSortChange = (sortBy: FilterState["sortBy"]) => {
          setFilters((prev) => ({
               ...prev,
               sortBy: prev.sortBy === sortBy ? "" : sortBy,
          }));
     };

     const handleSortOrderChange = (order: "asc" | "desc") => {
          setFilters((prev) => ({
               ...prev,
               sortOrder: order,
          }));
     };

     const handleApply = () => {
          if (onApplyFilters) {
               onApplyFilters(filters);
          }
          onClose();
     };

     const handleReset = () => {
          const resetFilters: FilterState = {
               status: [],
               typeNote: [],
               sortBy: "",
               sortOrder: "asc",
          };
          setFilters(resetFilters);
          if (onApplyFilters) {
               onApplyFilters(resetFilters);
          }
          onClose();
     };

     if (!isOpen) return null;

     return (
          <>
               {/* Overlay */}
               <div 
                    className="fixed inset-0 z-40 bg-black/10"
                    onClick={onClose}
               />
               
               {/* Modal Compacto */}
               <div className="fixed top-20 right-4 z-50 w-72 bg-white rounded-xl shadow-2xl border border-gray-100">
                    {/* Header Compacto */}
                    <div className="flex justify-between items-center px-4 py-2.5 border-b border-gray-100">
                         <h3 className="text-sm font-semibold text-gray-800">Filtros</h3>
                         <button
                              onClick={onClose}
                              className="text-gray-400 hover:text-gray-600 transition text-lg leading-none w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100"
                              aria-label="Fechar"
                         >
                              ×
                         </button>
                    </div>

                    {/* Content Compacto */}
                    <div className="p-4 space-y-4 max-h-[calc(100vh-14rem)] overflow-y-auto">
                         {/* Status - Grid Compacto */}
                         <div>
                              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2.5">Status</h4>
                              <div className="grid grid-cols-3 gap-1.5">
                                   {statusOptions.map((status) => (
                                        <label
                                             key={status}
                                             className={`flex items-center justify-center px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                                                  filters.status.includes(status)
                                                       ? "bg-[#724EBF] text-white shadow-sm"
                                                       : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                             }`}
                                        >
                                             <input
                                                  type="checkbox"
                                                  checked={filters.status.includes(status)}
                                                  onChange={() => handleStatusToggle(status)}
                                                  className="sr-only"
                                             />
                                             {status}
                                        </label>
                                   ))}
                              </div>
                         </div>

                         {/* Tipo de Garantia - Grid Compacto */}
                         <div>
                              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2.5">Tipo</h4>
                              <div className="grid grid-cols-2 gap-1.5">
                                   {typeNoteOptions.map((type) => (
                                        <label
                                             key={type}
                                             className={`flex items-center justify-center px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all text-center ${
                                                  filters.typeNote.includes(type)
                                                       ? "bg-[#724EBF] text-white shadow-sm"
                                                       : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                             }`}
                                        >
                                             <input
                                                  type="checkbox"
                                                  checked={filters.typeNote.includes(type)}
                                                  onChange={() => handleTypeToggle(type)}
                                                  className="sr-only"
                                             />
                                             {type === "Garantia de Assistência" ? "Assistência" : type.replace("Garantia ", "")}
                                        </label>
                                   ))}
                              </div>
                         </div>

                         {/* Ordenação */}
                         <div>
                              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2.5">Ordenar</h4>
                              <div className="space-y-1">
                                   <label className={`flex items-center px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                                        filters.sortBy === "createdDate" ? "bg-[#724EBF]/10 text-[#724EBF] font-medium" : "hover:bg-gray-50 text-gray-700"
                                   }`}>
                                        <input
                                             type="radio"
                                             name="sortBy"
                                             checked={filters.sortBy === "createdDate"}
                                             onChange={() => handleSortChange("createdDate")}
                                             className="w-3.5 h-3.5 text-[#724EBF] border-gray-300 focus:ring-[#724EBF]"
                                        />
                                        <span className="ml-2">Data de criação</span>
                                   </label>
                                   <label className={`flex items-center px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                                        filters.sortBy === "purchaseDate" ? "bg-[#724EBF]/10 text-[#724EBF] font-medium" : "hover:bg-gray-50 text-gray-700"
                                   }`}>
                                        <input
                                             type="radio"
                                             name="sortBy"
                                             checked={filters.sortBy === "purchaseDate"}
                                             onChange={() => handleSortChange("purchaseDate")}
                                             className="w-3.5 h-3.5 text-[#724EBF] border-gray-300 focus:ring-[#724EBF]"
                                        />
                                        <span className="ml-2">Data de compra</span>
                                   </label>
                                   <label className={`flex items-center px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                                        filters.sortBy === "value" ? "bg-[#724EBF]/10 text-[#724EBF] font-medium" : "hover:bg-gray-50 text-gray-700"
                                   }`}>
                                        <input
                                             type="radio"
                                             name="sortBy"
                                             checked={filters.sortBy === "value"}
                                             onChange={() => handleSortChange("value")}
                                             className="w-3.5 h-3.5 text-[#724EBF] border-gray-300 focus:ring-[#724EBF]"
                                        />
                                        <span className="ml-2">Valor</span>
                                   </label>
                              </div>

                              {/* Ordem */}
                              {filters.sortBy && (
                                   <div className="mt-2.5 pt-2.5 border-t border-gray-100">
                                        <div className="flex gap-1.5">
                                             <button
                                                  onClick={() => handleSortOrderChange("asc")}
                                                  className={`flex-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                                       filters.sortOrder === "asc"
                                                            ? "bg-[#724EBF] text-white shadow-sm"
                                                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                                  }`}
                                             >
                                                  ↑ Crescente
                                             </button>
                                             <button
                                                  onClick={() => handleSortOrderChange("desc")}
                                                  className={`flex-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                                       filters.sortOrder === "desc"
                                                            ? "bg-[#724EBF] text-white shadow-sm"
                                                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                                  }`}
                                             >
                                                  ↓ Decrescente
                                             </button>
                                        </div>
                                   </div>
                              )}
                         </div>
                    </div>

                    {/* Footer Compacto */}
                    <div className="px-4 py-2.5 border-t border-gray-100 flex gap-2 bg-gray-50/50">
                         <button
                              onClick={handleReset}
                              className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                         >
                              Limpar
                         </button>
                         <button
                              onClick={handleApply}
                              className="flex-1 px-3 py-2 text-xs font-medium text-white bg-[#724EBF] rounded-lg hover:bg-[#5a3a9f] transition shadow-sm"
                         >
                              Aplicar
                         </button>
                    </div>
               </div>
          </>
     );
};

export default FilterModal;

