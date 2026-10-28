import { useOutletContext } from "react-router-dom";

export type SelectedMonthContext = {
  mes: Date;
  setMes: (date: Date) => void;
};

// mes compartido por todas las páginas dentro del Layout
export const useSelectedMonth = () => useOutletContext<SelectedMonthContext>();