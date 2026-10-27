import { AppBar, Button, Container, CssBaseline, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TOKEN_KEY } from "./api/axiosClient";
import Login from "./components/Auth/Login";
import AddTransaction from "./components/Transactions/AddTransaction";
import TransactionsList from "./components/Transactions/TransactionsList";

function App() {
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem(TOKEN_KEY));

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    queryClient.clear(); // borra los datos en caché del usuario anterior
    setIsAuthenticated(false);
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            FinTrak
          </Typography>
          {isAuthenticated && (
            <Button color="inherit" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {isAuthenticated ? (
        <Container maxWidth="xl" sx={{ mt: 3 }}>
          <TransactionsList />
        </Container>
      ) : (
        <Login onLogin={() => setIsAuthenticated(true)} />
      )}
    </>
  );
}

export default App;