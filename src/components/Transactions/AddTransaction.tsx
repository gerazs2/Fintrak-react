import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TransactionRequest } from "../../types/TransactionType";
import { addTransaction } from "../../api/transactionApi";
import { toISODate } from "../../utils/format";
import TransactionDialogContent from "./TransactionDialogContent";

const initialState: TransactionRequest = {
    descripcion: "",
    monto: 0,
    tipo: "GASTO",
    fecha: toISODate(new Date()),
    categoriaId: 0,
};

function AddTransaction() {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [transaction, setTransaction] = useState<TransactionRequest>(initialState);

    const { mutate, isLoading } = useMutation(addTransaction, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transacciones"] });
            handleClose();
        },
        onError: (err) => console.log(err),
    });

    const handleClickOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
        setTransaction(initialState);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setTransaction((prev) => ({
            ...prev,
            [name]: name === "monto" || name === "categoriaId" ? Number(value) : value,
        }));
    };

    const handleSave = () => mutate(transaction);

    return (
        <>
            <Button variant="contained" onClick={handleClickOpen}>
                Nueva transacción
            </Button>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Nueva transacción</DialogTitle>
                <TransactionDialogContent transaction={transaction} handleChange={handleChange} />
                <DialogActions>
                    <Button color="error" onClick={handleClose}>Cancelar</Button>
                    <Button variant="contained" onClick={handleSave} disabled={isLoading}>
                        {isLoading ? "Guardando..." : "Guardar"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AddTransaction;