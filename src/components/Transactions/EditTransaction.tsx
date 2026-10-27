import { Button, Dialog, DialogActions, DialogTitle, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TransactionRequest, TransactionResponse } from "../../types/TransactionType";
import { updateTransaction } from "../../api/transactionApi";
import TransactionDialogContent from "./TransactionDialogContent";

type EditTransactionProps = {
  transactionData: TransactionResponse;
};

const toRequest = (t: TransactionResponse): TransactionRequest => ({
  descripcion: t.descripcion,
  monto: t.monto,
  tipo: t.tipo,
  fecha: t.fecha,
  categoriaId: t.categoriaId,
});

function EditTransaction({ transactionData }: EditTransactionProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [transaction, setTransaction] = useState<TransactionRequest>(toRequest(transactionData));

  const { mutate, isLoading } = useMutation(updateTransaction, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transacciones"] });
      setOpen(false);
    },
    onError: (err) => console.log(err),
  });

  const handleClickOpen = () => {
    setTransaction(toRequest(transactionData));
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setTransaction((prev) => ({
      ...prev,
      [name]: name === "monto" || name === "categoriaId" ? Number(value) : value,
    }));
  };

  const handleSave = () => mutate({ id: transactionData.id, transaction });

  return (
    <>
      <Tooltip title="Editar">
        <IconButton size="small" color="primary" onClick={handleClickOpen}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Editar transacción</DialogTitle>
        <TransactionDialogContent transaction={transaction} handleChange={handleChange} />
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EditTransaction;