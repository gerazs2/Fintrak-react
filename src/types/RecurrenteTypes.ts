export type Frecuencia = "SEMANAL" | "QUINCENAL" | "MENSUAL" | "ANUAL";
export type ModoRecurrente = "AUTOMATICO" | "CONFIRMAR";

export type RecurrenteRequest = {
  monto: number;
  descripcion: string;
  categoriaId: number;
  frecuencia: Frecuencia;
  fechaInicio: string;
  modo: ModoRecurrente;
  fechaFin: string | null;
};

export type PendienteResponse = {
  id: number;
  recurrenteId: number;
  descripcion: string;
  categoriaNombre: string;
  tipo: "INGRESO" | "GASTO";
  fecha: string;
  monto: number;
};