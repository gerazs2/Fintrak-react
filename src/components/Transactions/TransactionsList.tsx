import type { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Box, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import type { PageResponse, TransactionResponse } from "../../types/TransactionType";
import { deleteTransaction, getTransactions } from "../../api/transactionApi";
import { formatCurrency, formatDate } from "../../utils/format";
import AddTransaction from "./AddTransaction";
import EditTransaction from "./EditTransaction";

function TransactionsList() {
  const queryClient = useQueryClient();

  const { data, error, isLoading, isError } = useQuery<PageResponse<TransactionResponse>, AxiosError>({
    queryKey: ["transacciones"],
    queryFn: getTransactions,
  });

  const { mutate } = useMutation(deleteTransaction, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transacciones"] });
    },
    onError: (err) => console.log(err),
  });

  const handleDelete = (transaction: TransactionResponse) => {
    if (window.confirm(`¿Eliminar "${transaction.descripcion}"?`)) {
      mutate(transaction.id);
    }
  };

  const columns: GridColDef<TransactionResponse>[] = [
    { field: "descripcion", headerName: "Descripción", flex: 2, minWidth: 180 },
    { field: "categoriaNombre", headerName: "Categoría", flex: 1, minWidth: 130 },
    {
      field: "tipo",
      headerName: "Tipo",
      flex: 1,
      minWidth: 110,
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
      field: "monto",
      headerName: "Monto",
      flex: 1,
      minWidth: 130,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => {
        const isIngreso = params.row.tipo === "INGRESO";
        return (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              lineHeight: "inherit",
              color: isIngreso ? "success.main" : "error.main",
            }}
          >
            {isIngreso ? "+" : "-"}
            {formatCurrency(params.value)}
          </Typography>
        );
      },
    },
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 1,
      minWidth: 120,
      valueFormatter: (value: string) => formatDate(value),
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
          <EditTransaction transactionData={params.row} />
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
        <Typography variant="h5">Transacciones</Typography>
        <AddTransaction />
      </Stack>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error {error.response?.status}: {error.message}
        </Alert>
      )}

      <DataGrid
        rows={data?.contenido ?? []}
        columns={columns}
        loading={isLoading}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        initialState={{
          sorting: { sortModel: [{ field: "fecha", sort: "desc" }] },
        }}
        disableRowSelectionOnClick
        sx={{ bgcolor: "background.paper" }}
      />
    </Box>
  );
}

export default TransactionsList;