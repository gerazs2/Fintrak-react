import { Alert, Box, Button, Paper, Stack, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useMutation } from "@tanstack/react-query";
import { analizarMes } from "../../api/asistenteApi";
import { formatMonth, toYearMonth } from "../../utils/format";
import { getApiErrorMessage } from "../../utils/apiError";

type AiChatProps = {
  mes: Date; // el mes seleccionado en la página
};

function AiChat({ mes }: AiChatProps) {
  const mesTexto = toYearMonth(mes); // "2026-11"

  const { mutate, data, isLoading, isError, error } = useMutation(analizarMes);

  // si cambias de mes, el análisis anterior ya no aplica
  const analisis = data?.mes === mesTexto ? data : undefined;

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2 }}>
        <AutoAwesomeIcon color="primary" />
        <Typography variant="subtitle1" sx={{ fontWeight: 600, flexGrow: 1 }}>
          Asistente IA
        </Typography>
        {data && (
          <Typography variant="caption" color="text.secondary">
            Te quedan {data.restantesHoy} análisis hoy
          </Typography>
        )}
      </Stack>

      {analisis ? (
        // pre-line respeta los saltos de línea que manda la IA
        <Box sx={{ bgcolor: "action.hover", borderRadius: 2, p: 2, whiteSpace: "pre-line" }}>
          <Typography variant="body2">{analisis.analisis}</Typography>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Pide un análisis de {formatMonth(mes)}: resumen, alertas de presupuesto, tendencia y recomendaciones.
        </Typography>
      )}

      {isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {getApiErrorMessage(error, "No se pudo generar el análisis")}
        </Alert>
      )}

      <Button
        variant="contained"
        startIcon={<AutoAwesomeIcon />}
        loading={isLoading}
        onClick={() => mutate(mesTexto)}
        sx={{ mt: 2 }}
      >
        {analisis ? "Volver a analizar" : "Analizar este mes"}
      </Button>
    </Paper>
  );
}

export default AiChat;