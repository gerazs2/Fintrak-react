import api from "./axiosClient";
import type { Categoria, CategoryResponse } from "../types/CategoryTypes";

export const getCategories = async (): Promise<CategoryResponse[]> => {
  const response = await api.get<CategoryResponse[]>("/categorias");
  return response.data;
};

export const addCategory = async (category: Categoria): Promise<CategoryResponse> => {
  const response = await api.post<CategoryResponse>("/categorias", category);
  return response.data;
};

export const updateCategory = async ({
  id,
  category,
}: {
  id: number;
  category: Categoria;
}): Promise<CategoryResponse> => {
  const response = await api.put<CategoryResponse>(`/categorias/${id}`, category);
  return response.data;
};

export const deleteCategory = async (id: number) : Promise<void> =>{
  await api.delete(`/categorias/${id}`);
};