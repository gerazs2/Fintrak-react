import type { PendienteResponse, RecurrenteRequest } from "../types/RecurrenteTypes";
import api from "./axiosClient";

export const addRecurrente = async (recurrente: RecurrenteRequest) => {
  const response = await api.post("/recurrentes", recurrente);
  return response.data;
};

export const getPendientes = async (): Promise<PendienteResponse[]> => {
  const response = await api.get<PendienteResponse[]>("/recurrentes/pendientes");
  return response.data;
};

export const confirmarPendiente = async (id: number): Promise<void> => {
  await api.post(`/recurrentes/pendientes/${id}/confirmar`);
};

export const omitirPendiente = async (id: number): Promise<void> => {
  await api.post(`/recurrentes/pendientes/${id}/omitir`);
};