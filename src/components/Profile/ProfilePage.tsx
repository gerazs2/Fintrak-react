import { Alert, Box, Button, Paper, Skeleton, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { PerfilResponse } from "../../types/ProfileTypes";
import { changePassword, getProfile, updateProfile } from "../../api/profileApi";
import { saveToken } from "../../api/axiosClient";
import { getApiErrorMessage } from "../../utils/apiError";

const MIN_PASSWORD_LENGTH = 8;

const emptyPasswords = { passwordActual: "", passwordNueva: "", confirmar: "" };

// Formulario de datos: se monta cuando el perfil ya llegó, así el campo empieza con el nombre actual
function ProfileDataForm({ profile }: { profile: PerfilResponse }) {
  const queryClient = useQueryClient();
  const [nombre, setNombre] = useState(profile.nombre);

  const profileMutation = useMutation(updateProfile, {
    onSuccess: (data) => {
      queryClient.setQueryData(["perfil"], data); // actualiza la caché sin volver a pedirlo
    },
  });

  const nombreSinCambios = nombre.trim() === profile.nombre;

  const handleSaveProfile = (event: React.FormEvent) => {
    event.preventDefault();
    profileMutation.mutate({ nombre: nombre.trim() });
  };

  return (
    <form onSubmit={handleSaveProfile}>
      <Stack spacing={2}>
        <TextField label="Correo" value={profile.email} disabled fullWidth />
        <TextField
          label="Nombre"
          value={nombre}
          onChange={(e) => {
            setNombre(e.target.value);
            profileMutation.reset();
          }}
          slotProps={{ htmlInput: { maxLength: 100 } }}
          required
          fullWidth
        />

        {profileMutation.isSuccess && <Alert severity="success">Nombre actualizado</Alert>}
        {profileMutation.isError && (
          <Alert severity="error">
            {getApiErrorMessage(profileMutation.error, "No se pudo actualizar el nombre")}
          </Alert>
        )}

        <Box>
          <Button
            type="submit"
            variant="contained"
            disabled={!nombre.trim() || nombreSinCambios || profileMutation.isLoading}
          >
            {profileMutation.isLoading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </Box>
      </Stack>
    </form>
  );
}

function ProfilePage() {
  // ---------- Datos de la cuenta ----------
  const profile = useQuery<PerfilResponse, AxiosError>({
    queryKey: ["perfil"],
    queryFn: getProfile,
  });

  // ---------- Cambiar contraseña ----------
  const [passwords, setPasswords] = useState(emptyPasswords);

  const passwordMutation = useMutation(changePassword, {
    onSuccess: (data) => {
      saveToken(data.token); // los tokens anteriores ya no sirven: guardamos el nuevo
      setPasswords(emptyPasswords);
    },
  });

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPasswords((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    passwordMutation.reset(); // oculta el mensaje anterior al volver a escribir
  };

  const nuevaMuyCorta = passwords.passwordNueva.length > 0 && passwords.passwordNueva.length < MIN_PASSWORD_LENGTH;
  const noCoinciden = passwords.confirmar.length > 0 && passwords.confirmar !== passwords.passwordNueva;
  const puedeCambiar =
    passwords.passwordActual.length > 0 &&
    passwords.passwordNueva.length >= MIN_PASSWORD_LENGTH &&
    passwords.confirmar === passwords.passwordNueva;

  const handleSavePassword = (event: React.FormEvent) => {
    event.preventDefault();
    passwordMutation.mutate({
      passwordActual: passwords.passwordActual,
      passwordNueva: passwords.passwordNueva,
    });
  };

  return (
    <Box sx={{ maxWidth: 560 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Mi perfil
      </Typography>

      {/* Datos de la cuenta */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Datos de la cuenta
        </Typography>

        {profile.isLoading ? (
          <Stack spacing={2}>
            <Skeleton height={56} />
            <Skeleton height={56} />
          </Stack>
        ) : profile.isError ? (
          <Alert severity="error">No se pudo cargar tu perfil</Alert>
        ) : (
          <ProfileDataForm profile={profile.data} />
        )}
      </Paper>

      {/* Cambiar contraseña */}
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Cambiar contraseña
        </Typography>

        <form onSubmit={handleSavePassword}>
          <Stack spacing={2}>
            <TextField
              label="Contraseña actual"
              name="passwordActual"
              type="password"
              autoComplete="current-password"
              value={passwords.passwordActual}
              onChange={handlePasswordChange}
              required
              fullWidth
            />
            <TextField
              label="Nueva contraseña"
              name="passwordNueva"
              type="password"
              autoComplete="new-password"
              value={passwords.passwordNueva}
              onChange={handlePasswordChange}
              error={nuevaMuyCorta}
              helperText={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres`}
              required
              fullWidth
            />
            <TextField
              label="Confirmar nueva contraseña"
              name="confirmar"
              type="password"
              autoComplete="new-password"
              value={passwords.confirmar}
              onChange={handlePasswordChange}
              error={noCoinciden}
              helperText={noCoinciden ? "Las contraseñas no coinciden" : " "}
              required
              fullWidth
            />

            {passwordMutation.isSuccess && <Alert severity="success">Contraseña actualizada</Alert>}
            {passwordMutation.isError && (
              <Alert severity="error">
                {getApiErrorMessage(passwordMutation.error, "No se pudo cambiar la contraseña")}
              </Alert>
            )}

            <Box>
              <Button type="submit" variant="contained" disabled={!puedeCambiar || passwordMutation.isLoading}>
                {passwordMutation.isLoading ? "Guardando..." : "Cambiar contraseña"}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

export default ProfilePage;