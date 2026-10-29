import api from "./axiosClient";
import type {
  ActualizarPerfilRequest,
  AuthResponse,
  CambiarPasswordRequest,
  PerfilResponse,
} from "../types/ProfileTypes";

export const getProfile = async (): Promise<PerfilResponse> => {
  const response = await api.get<PerfilResponse>("/usuarios/me");
  return response.data;
};

export const updateProfile = async (data: ActualizarPerfilRequest): Promise<PerfilResponse> => {
  const response = await api.patch<PerfilResponse>("/usuarios/me", data);
  return response.data;
};

// el backend invalida los tokens anteriores y regresa uno nuevo
export const changePassword = async (data: CambiarPasswordRequest): Promise<AuthResponse> => {
  const response = await api.put<AuthResponse>("/usuarios/me/password", data);
  return response.data;
};