import { CssBaseline } from "@mui/material";
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { TOKEN_KEY } from "./api/axiosClient";
import Login from "./components/Auth/Login";
import Layout from "./components/Layout/Layout";
import TransactionsList from "./components/Transactions/TransactionsList";
import CategoriesList from "./components/Categories/CategoriesList";

function App() {
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem(TOKEN_KEY));

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    queryClient.clear();
    setIsAuthenticated(false);
  };

  return (
    <>
      <CssBaseline />
      {isAuthenticated ? (
        <Routes>
          <Route element={<Layout onLogout={handleLogout} />}>
            <Route path="/transacciones" element={<TransactionsList />} />
            <Route path="/categorias" element={<CategoriesList />} />
            <Route path="*" element={<Navigate to="/transacciones" replace />} />
          </Route>
        </Routes>
      ) : (
        <Login onLogin={() => setIsAuthenticated(true)} />
      )}
    </>
  );
}

export default App;