import api from "./axiosClient";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  nombre: string;
};

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", credentials);
  return response.data;
};

export type RegisterRequest = {
  nombre: string;
  email: string;
  password: string;
};

export const register = async (data: RegisterRequest): Promise<void> => {
  await api.post("/auth/register", data);
};