export type PerfilResponse = {
  id: number;
  email: string;
  nombre: string;
};

export type ActualizarPerfilRequest = {
  nombre: string;
};

export type CambiarPasswordRequest = {
  passwordActual: string;
  passwordNueva: string;
};

export type AuthResponse = {
  token: string;
  nombre: string;
};