import { Button, Collapse, Dialog, DialogActions, DialogTitle, FormControlLabel, MenuItem, Stack, Switch, TextField } from "@mui/material";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TransactionRequest } from "../../types/TransactionType";
import type { Frecuencia, ModoRecurrente } from "../../types/RecurrenteTypes";
import { addTransaction } from "../../api/transactionApi";
import { addRecurrente } from "../../api/recurrenteApi"; // PASO 4
import { toISODate } from "../../utils/format";
import TransactionDialogContent from "./TransactionDialogContent";

const initialState: TransactionRequest = {
    descripcion: "",
    monto: 0,
    tipo: "GASTO",
    fecha: toISODate(new Date()),
    categoriaId: 0,
};

type RecurrenteOpciones = {
    frecuencia: Frecuencia;
    modo: ModoRecurrente;
    fechaFin: string;
};

const initialRecurrente: RecurrenteOpciones = {
    frecuencia: "MENSUAL",
    modo: "CONFIRMAR",
    fechaFin: "",
};

function AddTransaction() {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [repetir, setRepetir] = useState(false);
    const [transaction, setTransaction] = useState<TransactionRequest>(initialState);
    const [recurrente, setRecurrente] = useState<RecurrenteOpciones>(initialRecurrente);

    // PASO 4: lo que pasa al guardar bien, sea transacción o recurrente
    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["transacciones"] });
        queryClient.invalidateQueries({ queryKey: ["pendientes"] });
        handleClose();
    };

    // PASO 4: una mutación para cada endpoint
    const transaccionMutation = useMutation(addTransaction, {
        onSuccess,
        onError: (err) => console.log(err),
    });

    const recurrenteMutation = useMutation(addRecurrente, {
        onSuccess,
        onError: (err) => console.log(err),
    });

    const isLoading = transaccionMutation.isLoading || recurrenteMutation.isLoading; // PASO 4

    const handleClickOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
        setTransaction(initialState);
        setRepetir(false);
        setRecurrente(initialRecurrente);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setTransaction((prev) => ({
            ...prev,
            [name]: name === "monto" || name === "categoriaId" ? Number(value) : value,
        }));
    };

    const handleRecurrenteChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setRecurrente((prev) => ({ ...prev, [name]: value }));
    };

    // PASO 4: decide a qué endpoint mandar
    const handleSave = () => {
        if (!repetir) {
            transaccionMutation.mutate(transaction);
            return;
        }

        recurrenteMutation.mutate({
            monto: transaction.monto,
            descripcion: transaction.descripcion,
            categoriaId: transaction.categoriaId,
            fechaInicio: transaction.fecha,          // la fecha del formulario es la de inicio
            frecuencia: recurrente.frecuencia,
            modo: recurrente.modo,
            fechaFin: recurrente.fechaFin || null,   // vacío -> null
        });
    };

    return (
        <>
            <Button variant="outlined" onClick={handleClickOpen}>
                Nueva transacción
            </Button>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Nueva transacción</DialogTitle>

                <TransactionDialogContent transaction={transaction} handleChange={handleChange}>
                    <FormControlLabel
                        control={<Switch checked={repetir} onChange={(e) => setRepetir(e.target.checked)} />}
                        label="Repetir"
                    />

                    <Collapse in={repetir} unmountOnExit>
                        <Stack spacing={2}>
                            <TextField select label="Frecuencia" name="frecuencia"
                                value={recurrente.frecuencia} onChange={handleRecurrenteChange}>
                                <MenuItem value="SEMANAL">Semanal</MenuItem>
                                <MenuItem value="QUINCENAL">Quincenal</MenuItem>
                                <MenuItem value="MENSUAL">Mensual</MenuItem>
                                <MenuItem value="ANUAL">Anual</MenuItem>
                            </TextField>

                            <TextField select label="Al llegar la fecha" name="modo"
                                value={recurrente.modo} onChange={handleRecurrenteChange}>
                                <MenuItem value="AUTOMATICO">Registrar automáticamente</MenuItem>
                                <MenuItem value="CONFIRMAR">Pedirme confirmación</MenuItem>
                            </TextField>

                            <TextField label="Fecha fin (opcional)" name="fechaFin" type="date"
                                value={recurrente.fechaFin} onChange={handleRecurrenteChange}
                                slotProps={{ inputLabel: { shrink: true } }} />
                        </Stack>
                    </Collapse>
                </TransactionDialogContent>

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