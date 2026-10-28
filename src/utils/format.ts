const pad2 = (n: number) => String(n).padStart(2, "0");
export const toISODate = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

export const formatCurrency = (value: number): string => currencyFormatter.format(value);

export const formatDate = (fecha: string): string =>
  new Date(`${fecha}T00:00:00`).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// primer día del mes actual
export const getCurrentMonth = (): Date => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1);
};

// primer y último día del mes de la fecha dada, en formato yyyy-MM-dd
export const getMonthRange = (date: Date) => {
  const desde = new Date(date.getFullYear(), date.getMonth(), 1);
  const hasta = new Date(date.getFullYear(), date.getMonth() + 1, 0); // día 0 = último del mes anterior
  return { desde: toISODate(desde), hasta: toISODate(hasta) };
};

// "Octubre de 2026"
export const formatMonth = (date: Date): string => {
  const text = date.toLocaleDateString("es-MX", { month: "long", year: "numeric" });
  return text.charAt(0).toUpperCase() + text.slice(1);
};