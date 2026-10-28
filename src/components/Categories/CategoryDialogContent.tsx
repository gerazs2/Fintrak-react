import { DialogContent, MenuItem, Stack, TextField } from "@mui/material";
import type { Categoria } from "../../types/CategoryTypes";

type CategoryDialogContentProps = {
  categoria: Categoria;
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  disableTipo: boolean;
  children?: React.ReactNode; // para mostrar un Alert de error debajo
};

function CategoryDialogContent({ categoria, handleChange,disableTipo = false ,children }: CategoryDialogContentProps) {
  return (
    <DialogContent>
      <Stack spacing={2} sx={{ mt: 1 }}>
        <TextField
          label="Nombre"
          name="nombre"
          value={categoria.nombre}
          onChange={handleChange}
          fullWidth
          autoFocus
        />
        <TextField
          select
          label="Tipo"
          name="tipo"
          disabled={disableTipo}
          helperText={disableTipo ? 'El tipo no se puede cambiar': undefined}
          value={categoria.tipo}
          onChange={handleChange}
          fullWidth
        >
          <MenuItem value="GASTO">Gasto</MenuItem>
          <MenuItem value="INGRESO">Ingreso</MenuItem>
        </TextField>
        {children}
      </Stack>
    </DialogContent>
  );
}

export default CategoryDialogContent;