import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { login, type LoginRequest, type LoginResponse } from "../../api/authApi";
import { TOKEN_KEY } from "../../api/axiosClient";

type LoginProps = {
  onLogin: () => void;
};

function Login({ onLogin }: LoginProps) {
  const [credentials, setCredentials] = useState<LoginRequest>({ email: "", password: "" });

  const { mutate, isLoading, isError, error } = useMutation<LoginResponse, AxiosError, LoginRequest>(login, {
    onSuccess: (data) => {
      localStorage.setItem(TOKEN_KEY, data.token);
      onLogin();
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // evita que el form recargue la página
    mutate(credentials);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Paper sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Iniciar sesión
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Correo"
              name="email"
              type="email"
              value={credentials.email}
              onChange={handleChange}
              required
              autoFocus
            />
            <TextField
              label="Contraseña"
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />

            {isError && (
              <Alert severity="error">
                {error.response?.status === 401 || error.response?.status === 403
                  ? "Correo o contraseña incorrectos"
                  : "No se pudo iniciar sesión"}
              </Alert>
            )}

            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

export default Login;