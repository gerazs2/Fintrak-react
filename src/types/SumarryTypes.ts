export type CategoriaResumen = {
  categoriaId: number;
  nombre: string;
  total: number;
  porcentaje: number;
};

export type ResumenResponse = {
  mes: string; // "2026-10"
  ingresos: number;
  gastos: number;
  balance: number;
  gastosPorCategoria: CategoriaResumen[];
  ingresosPorCategoria: CategoriaResumen[];
};

export type TendenciaMes = {
  mes: string; // "2026-10"
  ingresos: number;
  gastos: number;
  balance: number;
};