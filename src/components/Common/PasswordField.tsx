import { IconButton, InputAdornment, TextField, type TextFieldProps } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";

// Recibe los mismos props que un TextField normal
function PasswordField(props: TextFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      slotProps={{
        ...props.slotProps,
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={() => setVisible((v) => !v)}
                onMouseDown={(e) => e.preventDefault()} // evita que el campo pierda el foco
                edge="end"
              >
                {visible ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

export default PasswordField;