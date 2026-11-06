import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Chip, Divider, IconButton, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteRecurrente, getRecurrentes } from "../../api/recurrenteApi";
import type { Frecuencia, RecurrenteResponse } from "../../types/RecurrenteTypes";
import { formatCurrency, formatDate } from "../../utils/format";
import { getApiErrorMessage } from "../../utils/apiError";

const frecuenciaLabel: Record<Frecuencia, string> = {
  SEMANAL: "Semanal",
  QUINCENAL: "Quincenal",
  MENSUAL: "Mensual",
  ANUAL: "Anual",
};

function RecurrentesSection() {
  const queryClient = useQueryClient();

  const { data: recurrentes = [], isLoading } = useQuery({
    queryKey: ["recurrentes"],
    queryFn: getRecurrentes,
  });

  // espera a que la lista se recargue antes de quitar el spinner
  const deleteMutation = useMutation(deleteRecurrente, {
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["recurrentes"] }),
        queryClient.invalidateQueries({ queryKey: ["pendientes"] }),
      ]),
  });

  const handleDelete = (r: RecurrenteResponse) => {
    const nombre = r.descripcion || r.categoriaNombre;
    if (window.confirm(`¿Eliminar "${nombre}"? Las transacciones ya registradas se conservan.`)) {
      deleteMutation.mutate(r.id);
    }
  };

  if (isLoading) return <Skeleton height={60} />;

  if (recurrentes.length === 0) {
    return <Typography variant="body2" color="text.secondary">No tienes recurrentes.</Typography>;
  }

  return (
    <Stack divider={<Divider />} spacing={1.5}>
      {deleteMutation.isError && (
        <Alert severity="error">{getApiErrorMessage(deleteMutation.error, "No se pudo eliminar")}</Alert>
      )}

      {recurrentes.map((r) => {
        const isIngreso = r.tipo === "INGRESO";
        const eliminando = deleteMutation.isLoading && deleteMutation.variables === r.id;

        return (
          <Stack key={r.id} direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Stack sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="body1" noWrap>
                {r.descripcion || r.categoriaNombre}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {frecuenciaLabel[r.frecuencia]} · {r.categoriaNombre}
                {r.proximaFecha && ` · Próxima: ${formatDate(r.proximaFecha)}`}
              </Typography>
            </Stack>

            {!r.activa && <Chip size="small" label="Pausada" />}
            <Chip
              size="small"
              variant="outlined"
              label={r.modo === "AUTOMATICO" ? "Automática" : "Con confirmación"}
            />

            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: isIngreso ? "success.main" : "error.main", whiteSpace: "nowrap" }}
            >
              {isIngreso ? "+" : "-"}
              {formatCurrency(r.monto)}
            </Typography>

            <Tooltip title="Eliminar">
              <span>
                <IconButton
                  size="small"
                  color="error"
                  loading={eliminando}
                  disabled={deleteMutation.isLoading}
                  onClick={() => handleDelete(r)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        );
      })}
    </Stack>
  );
}

export default RecurrentesSection;