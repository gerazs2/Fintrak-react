import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material"; // PASO 2: vuelve Alert
import { useState } from "react";
import { useMutation } from "@tanstack/react-query"; // PASO 2
import { login, register, type RegisterRequest } from "../../api/authApi"; // PASO 2
import { TOKEN_KEY } from "../../api/axiosClient"; // PASO 2
import { getApiErrorMessage } from "../../utils/apiError"; // PASO 2
import PasswordField from "../Common/PasswordField";

const MIN_PASSWORD_LENGTH = 8;

type RegisterProps = {
  onBack: () => void;
  onLogin: () => void; // PASO 2: para entrar directo después de registrarse
};

const emptyForm = { nombre: "", email: "", password: "", confirmar: "" };

// PASO 2: registra y, si sale bien, hace login con los mismos datos
const registrarYEntrar = async (data: RegisterRequest) => {
  await register(data);
  return login({ email: data.email, password: data.password });
};

function Register({ onBack, onLogin }: RegisterProps) {
  const [form, setForm] = useState(emptyForm);

  // PASO 2
  const { mutate, isLoading, isError, error, reset } = useMutation(registrarYEntrar, {
    onSuccess: (data) => {
      localStorage.setItem(TOKEN_KEY, data.token);
      onLogin();
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    reset(); // PASO 2: oculta el error al volver a escribir
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
    // PASO 2: "confirmar" no se manda, el back no lo pide
    mutate({ nombre: form.nombre.trim(), email: form.email, password: form.password });
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

            {/* PASO 2: aquí se usa el Alert, con el mensaje que manda el back */}
            {isError && (
              <Alert severity="error">{getApiErrorMessage(error, "No se pudo crear la cuenta")}</Alert>
            )}

            <Button type="submit" variant="contained" disabled={!puedeEnviar || isLoading}>
              {isLoading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>

            <Button onClick={onBack} disabled={isLoading}>¿Ya tienes cuenta? Inicia sesión</Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

export default Register;