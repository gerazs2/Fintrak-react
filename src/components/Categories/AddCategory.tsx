import { Alert, Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { Categoria, CategoryResponse } from "../../types/CategoryTypes";
import { addCategory } from "../../api/categoryApi";
import CategoryDialogContent from "./CategoryDialogContent";

const initialState: Categoria = { nombre: "", tipo: "GASTO" };

function AddCategory() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [categoria, setCategoria] = useState<Categoria>(initialState);

  const { mutate, isLoading, isError, error, reset } = useMutation<CategoryResponse, AxiosError, Categoria>(
    addCategory,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categorias"] });
        handleClose();
      },
    }
  );

  const handleClose = () => {
    setOpen(false);
    setCategoria(initialState);
    reset();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCategoria((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSave = () => mutate({ ...categoria, nombre: categoria.nombre.trim() });

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Nueva categoría
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Nueva categoría</DialogTitle>
        <CategoryDialogContent categoria={categoria} disableTipo={false} handleChange={handleChange}>
          {isError && (
            <Alert severity="error">
              {error.response?.status === 409
                ? "Ya existe una categoría con ese nombre"
                : "No se pudo guardar la categoría"}
            </Alert>
          )}
        </CategoryDialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={!categoria.nombre.trim() || isLoading}>
            {isLoading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddCategory;