import type { TipoTransaccion } from "./TransactionType";

export type Categoria = {
    id?: number;
    nombre: string;
    tipo: TipoTransaccion;
};

export type CategoryResponse = {
    id:number;
    nombre: string;
    tipo: TipoTransaccion;
};