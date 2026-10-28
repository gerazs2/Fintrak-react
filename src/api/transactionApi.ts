import type { PageResponse, TransactionFilters, TransactionRequest, TransactionResponse } from "../types/TransactionType";
import api from "./axiosClient";

export const getTransactions = async (filters: TransactionFilters): Promise<PageResponse<TransactionResponse>> => {
  const response = await api.get<PageResponse<TransactionResponse>>("/transacciones", {
    params: { ...filters, size: 100 },
  });
  return response.data;
};

export const deleteTransaction = async (id: number): Promise<void> => {
  await api.delete(`/transacciones/${id}`);
};

export const addTransaction = async (transaction: TransactionRequest): Promise<TransactionResponse> => {
  const response = await api.post<TransactionResponse>("/transacciones", transaction);
  return response.data;
};

export const updateTransaction = async ({
  id,
  transaction,
}: {
  id: number;
  transaction: TransactionRequest;
}): Promise<TransactionResponse> => {
  const response = await api.put<TransactionResponse>(`/transacciones/${id}`, transaction);
  return response.data;
};