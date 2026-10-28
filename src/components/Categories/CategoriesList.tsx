import { Alert, Box, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { CategoryResponse } from "../../types/CategoryTypes";
import { useCategories } from "../../hooks/useCategory";
import { deleteCategory } from "../../api/categoryApi";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";

function CategoriesList() {
  const queryClient = useQueryClient();
  const { data: categorias = [], isLoading, isError, error } = useCategories();

  const deleteMutation = useMutation<void, AxiosError, number>(deleteCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
  });

  const handleDelete = (categoria: CategoryResponse) => {
    if (window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) {
      deleteMutation.reset(); // limpia un error anterior
      deleteMutation.mutate(categoria.id);
    }
  };

  const columns: GridColDef<CategoryResponse>[] = [
    { field: "nombre", headerName: "Nombre", flex: 2, minWidth: 180 },
    {
      field: "tipo",
      headerName: "Tipo",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          size="small"
          variant="outlined"
          label={params.value === "INGRESO" ? "Ingreso" : "Gasto"}
          color={params.value === "INGRESO" ? "success" : "error"}
        />
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 110,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Stack direction="row" sx={{ height: "100%", alignItems: "center" }}>
          <EditCategory categoryData={params.row} />
          <Tooltip title="Eliminar">
            <IconButton size="small" color="error" onClick={() => handleDelete(params.row)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">Categorías</Typography>
        <AddCategory />
      </Stack>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error {error.response?.status}: {error.message}
        </Alert>
      )}

      {deleteMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => deleteMutation.reset()}>
          {deleteMutation.error.response?.status === 409
            ? "No se puede eliminar: la categoría tiene transacciones registradas"
            : "No se pudo eliminar la categoría"}
        </Alert>
      )}

      <DataGrid
        rows={categorias}
        columns={columns}
        loading={isLoading}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        initialState={{
          sorting: { sortModel: [{ field: "nombre", sort: "asc" }] },
        }}
        disableRowSelectionOnClick
        sx={{ bgcolor: "background.paper" }}
      />
    </Box>
  );
}

export default CategoriesList;