import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, AlertTitle, Button, Stack, Typography } from "@mui/material";
import { confirmarPendiente, getPendientes, omitirPendiente } from "../../api/recurrenteApi";
import { formatCurrency, formatDate } from "../../utils/format";

function PendientesList() {
  const queryClient = useQueryClient();

  const { data: pendientes = [] } = useQuery({
    queryKey: ["pendientes"],
    queryFn: getPendientes,
  });

  const onSuccess = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["pendientes"] }),
      queryClient.invalidateQueries({ queryKey: ["transacciones"] }),
    ]);

  const confirmarMutation = useMutation(confirmarPendiente, { onSuccess });
  const omitirMutation = useMutation(omitirPendiente, { onSuccess });

  const isLoading = confirmarMutation.isLoading || omitirMutation.isLoading;

  if (pendientes.length === 0) return null;

  return (
    // 6.3: el contenido del Alert ocupa todo el ancho
    <Alert severity="warning" sx={{ mb: 2, "& .MuiAlert-message": { width: "100%" } }}>
      <AlertTitle>Pagos pendientes de confirmar ({pendientes.length})</AlertTitle>
      <Stack spacing={1}>
        {pendientes.map((p) => {
          // 6.3: ¿este renglón es el que se está procesando?
          const confirmando = confirmarMutation.isLoading && confirmarMutation.variables === p.id;
          const omitiendo = omitirMutation.isLoading && omitirMutation.variables === p.id;

          return (
            <Stack key={p.id} direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {formatDate(p.fecha)} · {p.descripcion || p.categoriaNombre} · {formatCurrency(p.monto)}
              </Typography>
              <Button size="small" variant="contained" color="success"
                loading={confirmando} disabled={isLoading}
                onClick={() => confirmarMutation.mutate(p.id)}>
                Confirmar
              </Button>
              <Button size="small" color="inherit"
                loading={omitiendo} disabled={isLoading}
                onClick={() => omitirMutation.mutate(p.id)}>
                Omitir
              </Button>
            </Stack>
          );
        })}
      </Stack>
    </Alert>
  );
}

export default PendientesList;