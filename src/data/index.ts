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
    status: "Em Garantia" | "Vencida" | "Vencendo";
    createdAt: string;
    numeroNota: string;
    phone?: string;
    observations?: string;
}

export const notas: Nota[] = [];


