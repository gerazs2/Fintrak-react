import axios, { AxiosError } from "axios";

export const TOKEN_KEY = "fintrak_token";
export const SESSION_EXPIRED_EVENT = "fintrak:session-expired";
export const TOKEN_CHANGED_EVENT = "fintrak:token-changed";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");

    // un 401 en el login es "contraseña incorrecta", no sesión vencida
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }

    return Promise.reject(error);
  }
);

// guarda un token nuevo y avisa a App para que reprograme el cierre de sesión
export const saveToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event(TOKEN_CHANGED_EVENT));
};

export default api;