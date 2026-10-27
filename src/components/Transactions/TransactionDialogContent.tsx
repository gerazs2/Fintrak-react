import { DialogContent, MenuItem, Stack, TextField } from "@mui/material";
import type { TransactionRequest } from "../../types/TransactionType";

type DialogFormProps = {
  transaction: TransactionRequest;
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

function TransactionDialogContent({ transaction, handleChange }: DialogFormProps) {
  return (
    <DialogContent>
      <Stack spacing={2} sx={{ mt: 1 }}>
        <TextField
          label="Descripción"
          name="descripcion"
          value={transaction.descripcion}
          onChange={handleChange}
        />
        <TextField
          label="Monto"
          name="monto"
          type="number"
          value={transaction.monto}
          onChange={handleChange}
        />
        <TextField
          select
          label="Tipo"
          name="tipo"
          value={transaction.tipo}
          onChange={handleChange}
        >
          <MenuItem value="GASTO">Gasto</MenuItem>
          <MenuItem value="INGRESO">Ingreso</MenuItem>
        </TextField>
        <TextField
          label="Fecha"
          name="fecha"
          type="date"
          value={transaction.fecha}
          onChange={handleChange}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="Categoría (id)"
          name="categoriaId"
          type="number"
          value={transaction.categoriaId}
          onChange={handleChange}
        />
      </Stack>
    </DialogContent>
  );
}

export default TransactionDialogContent;