import { isAxiosError } from "axios";

// Tu backend responde { "error": "mensaje" } o { "campo": "mensaje de validación" }
export const getApiErrorMessage = (error: unknown, fallback = "Ocurrió un error"): string => {
  if (isAxiosError(error)) {
    const body = error.response?.data;
    if (body && typeof body === "object") {
      const values = Object.values(body as Record<string, unknown>).filter(
        (v): v is string => typeof v === "string"
      );
      if (values.length > 0) return values.join(". ");
    }
  }
  return fallback;
};