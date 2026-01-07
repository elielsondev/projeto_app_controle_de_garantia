export interface ResumoItem {
    title: string;
    value: number;
    status: "total" | "expiring" | "active" | "expired";
}

export interface Nota {
    id: number;
    title: string;
    store: string;
    purchaseDate: string;
    typeNote: string;
    value: number;
    status: "Ativa" | "Vencida" | "Vencendo";
}

export const notas: Nota[] = [
  {
    id: 1,
    title: "Ventilador",
    store: "Atacadão",
    purchaseDate: "12/02/2025",
    typeNote: "Garantia Normal",
    value: 1000,
    status: "Ativa",
  },
  {
    id: 2,
    title: "Teclado Dell",
    store: "Magazine Luiza",
    purchaseDate: "12/02/2025",
    typeNote: "Garantia Estendida",
    value: 1000,
    status: "Vencida",
  },
  {
    id: 3,
    title: "Mouse Dell",
    store: "Magazine Luiza",
    purchaseDate: "12/02/2025",
    typeNote: "Garantia Normal",
    value: 1000,
    status: "Vencendo",
  },
  {
    id: 4,
    title: "Notebook Gamer",
    store: "Magazine Luiza",
    purchaseDate: "12/02/2025",
    typeNote: "Garantia Estendida",
    value: 8000,
    status: "Ativa",
  }
];


