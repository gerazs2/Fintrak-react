import { Alert, Box, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ResumenResponse, TendenciaMes } from "../../types/SumarryTypes";
import { getSummary, getTrend } from "../../api/summaryApi";
import { formatCurrency, formatShortMonth, toYearMonth } from "../../utils/format";
import { useSelectedMonth } from "../../hooks/useSelectedMonth";
import MonthSelector from "../Common/MonthSelector";
import SummaryCard from "./SummaryCard";

const TREND_MONTHS = 6;

function SummaryPage() {
  const { mes, setMes } = useSelectedMonth();
  const yearMonth = toYearMonth(mes);

  const summary = useQuery<ResumenResponse, AxiosError>({
    queryKey: ["resumen", yearMonth],
    queryFn: () => getSummary(yearMonth),
    keepPreviousData: true,
  });

  const trend = useQuery<TendenciaMes[], AxiosError>({
    queryKey: ["resumen", "tendencia", TREND_MONTHS],
    queryFn: () => getTrend(TREND_MONTHS),
  });

  const data = summary.data;
  const gastosPorCategoria = data?.gastosPorCategoria ?? [];
  const balanceColor = (data?.balance ?? 0) < 0 ? "error.main" : "success.main";

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" }, mb: 3 }}
      >
        <Typography variant="h5">Resumen</Typography>
        <MonthSelector value={mes} onChange={setMes} />
      </Stack>

      {summary.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          No se pudo cargar el resumen ({summary.error.response?.status ?? summary.error.message})
        </Alert>
      )}

      {/* Tarjetas */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 2,
          mb: 3,
        }}
      >
        <SummaryCard title="Ingresos" value={data?.ingresos} color="success.main" loading={summary.isLoading} />
        <SummaryCard title="Gastos" value={data?.gastos} color="error.main" loading={summary.isLoading} />
        <SummaryCard title="Balance" value={data?.balance} color={balanceColor} loading={summary.isLoading} />
      </Box>

      {/* Gráficas */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 2,
        }}
      >
        <Paper variant="outlined" sx={{ p: 2.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Gastos por categoría
          </Typography>

          {summary.isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : gastosPorCategoria.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 8, textAlign: "center" }}>
              Sin gastos registrados en este mes
            </Typography>
          ) : (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: "center" }}>
              <PieChart
                series={[
                  {
                    data: gastosPorCategoria.map((c) => ({
                      id: c.categoriaId,
                      value: c.total,
                      label: c.nombre,
                    })),
                    innerRadius: 55,
                    outerRadius: 95,
                    paddingAngle: 2,
                    cornerRadius: 4,
                    valueFormatter: (item) => formatCurrency(item.value),
                  },
                ]}
                width={220}
                height={220}
                hideLegend
              />

              <Stack spacing={1} sx={{ flexGrow: 1, width: "100%" }}>
                {gastosPorCategoria.map((c) => (
                  <Stack key={c.categoriaId} direction="row" sx={{ justifyContent: "space-between" }}>
                    <Typography variant="body2">{c.nombre}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatCurrency(c.total)} · {c.porcentaje}%
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          )}
        </Paper>

        <Paper variant="outlined" sx={{ p: 2.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Últimos {TREND_MONTHS} meses
          </Typography>

          {trend.isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : trend.isError ? (
            <Alert severity="error">No se pudo cargar la tendencia</Alert>
          ) : (
            <BarChart
              height={260}
              xAxis={[{ scaleType: "band", data: trend.data.map((t) => formatShortMonth(t.mes)) }]}
              series={[
                {
                  label: "Ingresos",
                  data: trend.data.map((t) => t.ingresos),
                  color: "#2e7d32",
                  valueFormatter: (v) => formatCurrency(v ?? 0),
                },
                {
                  label: "Gastos",
                  data: trend.data.map((t) => t.gastos),
                  color: "#d32f2f",
                  valueFormatter: (v) => formatCurrency(v ?? 0),
                },
              ]}
            />
          )}
        </Paper>
      </Box>
    </Box>
  );
}

export default SummaryPage;