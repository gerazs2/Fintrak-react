import api from "./axiosClient";
import type { ResumenResponse, TendenciaMes } from "../types/SumarryTypes";

// mes en formato "yyyy-MM"
export const getSummary = async (mes: string): Promise<ResumenResponse> => {
  const response = await api.get<ResumenResponse>("/resumen", { params: { mes } });
  return response.data;
};

export const getTrend = async (meses = 6): Promise<TendenciaMes[]> => {
  const response = await api.get<TendenciaMes[]>("/resumen/tendencia", { params: { meses } });
  return response.data;
};