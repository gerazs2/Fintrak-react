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

export type RecurrenteResponse = {
  id: number;
  monto: number;
  descripcion: string;
  categoriaId: number;
  categoriaNombre: string;
  tipo: "INGRESO" | "GASTO";
  frecuencia: Frecuencia;
  modo: ModoRecurrente;
  fechaInicio: string;
  fechaFin: string | null;
  proximaFecha: string | null;
  generadas: number;
  activa: boolean;
};