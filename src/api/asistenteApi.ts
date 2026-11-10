import type { AnalisisResponse } from "../types/AsistenteTypes";
import api from "./axiosClient";

// mes en formato "2026-11"
export const analizarMes = async (mes: string): Promise<AnalisisResponse> => {
  const response = await api.post<AnalisisResponse>("/asistente/analisis", null, { params: { mes } });
  return response.data;
};