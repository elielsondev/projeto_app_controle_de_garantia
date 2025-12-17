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
    status: string;
}

export const resumo: ResumoItem[] = [
    { title: "Total", value: 12, status: "total" },
    { title: "Vencendo", value: 3, status: "expiring" },
    { title: "Ativas", value: 12, status: "active" },
    { title: "Vencidas", value: 3, status: "expired" },
];

export const notas: Nota[] = [
    {
        id: 1,
        title: "Monitor Dell",
        store: "Magazine Luiza",
        purchaseDate: "12/02/2025",
        typeNote: "Garantia Normal",
        value: 1000,
        status: "Em garantia",
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
        id: 1,
        title: "Monitor Dell",
        store: "Magazine Luiza",
        purchaseDate: "12/02/2025",
        typeNote: "Garantia Normal",
        value: 1000,
        status: "Em garantia",
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
        id: 1,
        title: "Monitor Dell",
        store: "Magazine Luiza",
        purchaseDate: "12/02/2025",
        typeNote: "Garantia Normal",
        value: 1000,
        status: "Em garantia",
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
];

