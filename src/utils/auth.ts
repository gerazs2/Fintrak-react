export const getTokenExpiration = (token: string): number | null => {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(atob(base64));
    return typeof exp === "number" ? exp * 1000 : null; // exp viene en segundos
  } catch {
    return null;
  }
};

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  const expiration = getTokenExpiration(token);
  return expiration !== null && expiration > Date.now();
};