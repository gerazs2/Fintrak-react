import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import PasswordField from "../Common/PasswordField";

const MIN_PASSWORD_LENGTH = 8;

type RegisterProps = {
  onBack: () => void; // regresar al login
};

const emptyForm = { nombre: "", email: "", password: "", confirmar: "" };

function Register({ onBack }: RegisterProps) {
  const [form, setForm] = useState(emptyForm);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const passwordCorta = form.password.length > 0 && form.password.length < MIN_PASSWORD_LENGTH;
  const noCoinciden = form.confirmar.length > 0 && form.confirmar !== form.password;
  const puedeEnviar =
    form.nombre.trim() !== "" &&
    form.email !== "" &&
    form.password.length >= MIN_PASSWORD_LENGTH &&
    form.confirmar === form.password;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("registrar", form); // en el paso 2 esto llama al back
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Paper sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Crear cuenta
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="Nombre" name="nombre" value={form.nombre}
              onChange={handleChange} required autoFocus />
            <TextField label="Correo" name="email" type="email" value={form.email}
              onChange={handleChange} required />
            <PasswordField label="Contraseña" name="password" autoComplete="new-password"
              value={form.password} onChange={handleChange} required
              error={passwordCorta} helperText={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres`} />
            <PasswordField label="Confirmar contraseña" name="confirmar" autoComplete="new-password"
              value={form.confirmar} onChange={handleChange} required
              error={noCoinciden} helperText={noCoinciden ? "Las contraseñas no coinciden" : " "} />

            <Button type="submit" variant="contained" disabled={!puedeEnviar}>
              Crear cuenta
            </Button>

            <Button onClick={onBack}>¿Ya tienes cuenta? Inicia sesión</Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

export default Register;