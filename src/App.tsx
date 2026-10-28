import { CssBaseline } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { SESSION_EXPIRED_EVENT, TOKEN_KEY } from "./api/axiosClient";
import { getTokenExpiration, isTokenValid } from "./utils/auth";
import Login from "./components/Auth/Login";
import Layout from "./components/Layout/Layout";
import TransactionsList from "./components/Transactions/TransactionsList";
import CategoriesList from "./components/Categories/CategoriesList";
import SummaryPage from "./components/Summary/SummaryPage";

function App() {
  const queryClient = useQueryClient();

  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    isTokenValid(localStorage.getItem(TOKEN_KEY))
  );

  // si al abrir la app había un token pero ya venció, mostramos el aviso
  const [sessionExpired, setSessionExpired] = useState(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token && !isTokenValid(token);
  });

  const logout = useCallback(
    (expired: boolean) => {
      localStorage.removeItem(TOKEN_KEY);
      queryClient.clear();
      setSessionExpired(expired);
      setIsAuthenticated(false);
    },
    [queryClient]
  );

  // capa 1: el interceptor avisa que llegó un 401
  useEffect(() => {
    const handleExpired = () => logout(true);
    window.addEventListener(SESSION_EXPIRED_EVENT, handleExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleExpired);
  }, [logout]);

  // capa 2: cierra la sesión justo cuando vence el token
  useEffect(() => {
    if (!isAuthenticated) return;

    const token = localStorage.getItem(TOKEN_KEY);
    const expiration = token ? getTokenExpiration(token) : null;
    if (!expiration) return;

    const timeoutId = setTimeout(() => logout(true), expiration - Date.now());
    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, logout]);

  const handleLogin = () => {
    setSessionExpired(false);
    setIsAuthenticated(true);
  };

  return (
    <>
      <CssBaseline />
      {isAuthenticated ? (
        <Routes>
          <Route element={<Layout onLogout={() => logout(false)} />}>
            <Route path="/resumen" element={<SummaryPage />} />
            <Route path="/transacciones" element={<TransactionsList />} />
            <Route path="/categorias" element={<CategoriesList />} />
<Route path="*" element={<Navigate to="/resumen" replace />} />          </Route>
        </Routes>
      ) : (
        <Login onLogin={handleLogin} sessionExpired={sessionExpired} />
      )}
    </>
  );
}

export default App;