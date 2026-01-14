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
    dueDate:string;
    typeNote: string;
    createdBy: string;
    value: number;
    status: "Ativa" | "Vencida" | "Vencendo";
    createdAt: string;
    numeroNota: string;
    phone?: string;
    observations?: string;
}

export const notas: Nota[] = [
    {
        id: 1,
        title: "Ventilador",
        store: "Atacadão",
        purchaseDate: "12/02/2025",
        dueDate: "12/02/2026",
        typeNote: "Garantia Legal",
        createdBy: "Paulinho Rodriguês",
        value: 1000,
        status: "Ativa",
        createdAt: "01/01/2025",
        numeroNota: "001",
    },
    {
        id: 2,
        title: "Teclado Dell",
        store: "Magazine Luiza",
        purchaseDate: "12/02/2025",
        dueDate: "12/02/2026",
        typeNote: "Garantia Estendida",
        createdBy: "Paulinho Rodriguês",
        value: 1000,
        status: "Vencida",
        createdAt: "15/01/2025",
        numeroNota: "002",
    },
    {
        id: 3,
        title: "Mouse Dell",
        store: "Magazine Luiza",
        purchaseDate: "12/02/2025",
        dueDate: "12/02/2026",
        typeNote: "Garantia de Assistência",
        createdBy: "Paulinho Rodriguês",
        value: 1000,
        status: "Vencendo",
        createdAt: "20/01/2025",
        numeroNota: "003",
    },
    {
        id: 4,
        title: "Notebook Gamer",
        store: "Magazine Luiza",
        purchaseDate: "12/02/2025",
        dueDate: "12/02/2026",
        typeNote: "Garantia Estendida",
        createdBy: "Paulinho Rodriguês",
        value: 8000,
        status: "Ativa",
        createdAt: "25/01/2025",
        numeroNota: "004",
    }
];

