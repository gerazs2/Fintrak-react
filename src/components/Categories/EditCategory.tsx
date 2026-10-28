import { Alert, Button, Dialog, DialogActions, DialogTitle, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { Categoria, CategoryResponse } from "../../types/CategoryTypes";
import { updateCategory } from "../../api/categoryApi";
import CategoryDialogContent from "./CategoryDialogContent";

type EditCategoryProps = {
  categoryData: CategoryResponse;
};

const toRequest = (c: CategoryResponse): Categoria => ({
  nombre: c.nombre,
  tipo: c.tipo,
});

function EditCategory({ categoryData }: EditCategoryProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [categoria, setCategoria] = useState<Categoria>(toRequest(categoryData));

  const { mutate, isLoading, isError, error, reset } = useMutation<
    CategoryResponse,
    AxiosError,
    { id: number; category: Categoria }
  >(updateCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      queryClient.invalidateQueries({ queryKey: ["transacciones"] }); // las transacciones muestran el nombre
      setOpen(false);
    },
  });

  const handleClickOpen = () => {
    setCategoria(toRequest(categoryData)); // carga los datos actuales de la fila
    reset();
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCategoria((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSave = () =>
    mutate({ id: categoryData.id, category: { ...categoria, nombre: categoria.nombre.trim() } });

  return (
    <>
      <Tooltip title="Editar">
        <IconButton size="small" color="primary" onClick={handleClickOpen}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Editar categoría</DialogTitle>
        <CategoryDialogContent categoria={categoria} disableTipo={true} handleChange={handleChange}>
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

export default EditCategory;