// cada elemento
export type TransactionResponse = {
  id: number;
  monto: number;
  tipo: TipoTransaccion;
  fecha: string;
  descripcion: string;
  categoriaId: number;
  categoriaNombre: string;
};

export type TipoTransaccion = "INGRESO" | "GASTO";

// la respuesta completa del endpoint
export type PageResponse<T> = {
  contenido: T[];
  pagina: number;
  tamanio: number;
  totalElementos: number;
  totalPaginas: number;
  ultima: boolean;
};

export type TransactionRequest = {
  monto: number;
  tipo: TipoTransaccion;
  fecha: string;
  descripcion: string;
  categoriaId: number;
};

export type TransactionFilters = {
  desde: string;
  hasta: string;
};